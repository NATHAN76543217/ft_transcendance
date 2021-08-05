import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { getDefaultBall, pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import { canvasHeight, canvasWidth, whRatio } from "../../../models/game/canvasDims";
import { Events } from "../../../models/channel/Events";
import { IPlayer, Player } from "../../../models/game/Player";
import { Ball, defaultBall, IBall, IBallBase } from "../../../models/game/Ball";
import Popup from "reactjs-popup";
import { ruleOfThree } from "../engine/engine"

// TO DO: let animationId: number | undefined = undefined; IF NOT UNDEFINED -> LAUNCH RENDER

export type PongPageParams = {
  id: string;
};

enum Received {
  STATUS = (1 << 0),
  PLAYERS = Received.STATUS << 1,
  SCORES = Received.PLAYERS << 1,
  BALL = Received.SCORES << 1
}

export function Pong({ match }: RouteComponentProps<PongPageParams>) {
  const { user, eventSocket: appSocket } = useContext(AppContext);
  const { matchSocket } = useContext(AppContext);
  const history = useHistory();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const widthMargin = 50;
  //console.log("[pong.tsx] Pong.tsx has been called");

  const [canvSize, setCanvSize] = useState<{ h: number, w: number }>({
    h: window.innerHeight * 3 / 4,
    w: whRatio * window.innerHeight * 3 / 4
  });
  // const [canvHeight, setCanvHeight] = useState<number>(window.innerHeight * 3 / 4);
  // const [canvWidth, setCanvWidth] = useState<number>(canvHeight * whRatio);

  if (canvSize.w > (window.innerWidth - widthMargin)) {
    setCanvSize({
      h: (window.innerWidth - widthMargin) / whRatio,
      w: window.innerWidth - widthMargin
    })

    // setCanvHeight((window.innerWidth - widthMargin) / whRatio);
    // setCanvWidth(window.innerWidth - widthMargin);
  }

  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");

    const windowResizeEventHandler = () => {
      //console.log("[pong.tsx] Resize screen");

      // TO DO: SEEMS THIS CAN BE DONE IN 2 LINES (not need "if" just init h diferently)

      let h = window.innerHeight * 3 / 4;
      let w = h * whRatio;

      if (w > (window.innerWidth - widthMargin)) {
        w = window.innerWidth - widthMargin;
        h = w / whRatio;
      }
      setCanvSize({
        h: h,
        w: w
      })
      // setCanvHeight(h);
      // setCanvWidth(w);
    };

    window.addEventListener('resize', windowResizeEventHandler);

    return () => { window.removeEventListener('resize', windowResizeEventHandler); };

  }, []);

  useEffect(() => {
    if (
      matchSocket === undefined ||
      canvasRef.current === null ||
      ctx.current === null
    )
      return;

    let received: number = 0;
    let state: GameState = {
      status: GameStatus.UNREADY,
      players: [],
      scores: [0, 0],
      ball: getDefaultBall(canvSize.h)
    };
    console.log(`[pong.tsx] init ball with rad: ${state.ball.rad}`);
    let animationId: number | undefined = 0;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;

    const mouseEventHandler = (event: any) => {
      const rect = canvasRef.current!.getBoundingClientRect();

      const player = state.players.find((player) => player.id === user?.id);

      if (player) {
        let tmpVal = event.clientY - rect.top - player.height / 2;
        if (tmpVal < 0) tmpVal = 0;
        else if (tmpVal + player.height > canvSize.h) tmpVal = canvSize.h - player.height;
        player.y = tmpVal;

        matchSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
          x: event.clientX,
          y: (player.y * canvasHeight) / canvSize.h
        });
      }
    };

    const onJoined = (data: GameJoinedDto) => {
      console.log(`[pong.tsx] onJoined: role ${data.role}`);

      if (data.role === GameRole.Player) {
        canvasRef.current!.addEventListener("mousemove", mouseEventHandler);
        matchSocket?.emit(ServerMessages.PLAYER_READY);
      }
    };

    const onQuit = () => {
      history.push("/game");
    };

    // const ruleOfThree = (target: number) => {
    //   // Where y2 = (y1 * x2) / x1
    //   return (target * canvSize.h) / canvasHeight;
    // }

    const onReceiveStatus = (status: GameStatus) => {
      //console.log(`[pong.tsx] Received status: ${status}`);
      state.status = status;
      received |= Received.STATUS;
    };

    const onReceivePlayers = (players: Player[]) => {
      //console.log(`[pong.tsx] Received players: ${players}`);

      players.forEach((player) => {
        player.y = ruleOfThree(player.y, canvSize.h);
        player.x = ruleOfThree(player.x,  canvSize.h);
        player.height = ruleOfThree(player.height, canvSize.h);
        player.width = ruleOfThree(player.width, canvSize.h);
      });

      state.players = players;
      //console.log(`[pong.tsx] canvWidth: ${canvWidth}`);
      //state.players.forEach((player) => console.log(`[pong.tsx] game registered player y: ${player.y} x: ${player.x} side: ${player.side} id: ${player.id} userId: ${user?.id}`));
      received |= Received.PLAYERS;
    };

    const onReceiveScores = (scores: number[]) => {
      //console.log(`[pong.tsx] Received scores: ${[...scores]}`);
      state.scores = scores;
      //state.scores.forEach((score) => console.log(`[pong.tsx] game score: ${score}`));
      received |= Received.SCORES;
    };

    const onReceiveBall = (ball: IBall) => {
      //console.log(`[pong.tsx] Received ball: ${ball}`);

      //const respawn = state.ball.defaultBall;
      //console.log(`[pong.tsx] respawn rad: ${respawn.rad}`);
      state.ball = new Ball(
        {
          x: ruleOfThree(ball.x, canvSize.h),
          y: ruleOfThree(ball.y, canvSize.h)
        },
        {
          x: ruleOfThree(ball.dir.x, canvSize.h),
          y: ruleOfThree(ball.dir.y, canvSize.h)
        },
        ruleOfThree(ball.rad, canvSize.h),
        ruleOfThree(ball.velocity, canvSize.h)
      );
      //ball.rad = state.players[0].height / 3; // TO DO: Temporary, rm this line to know the reason of its existance
      // TO DO: Cals will be incoherent in server this the previous line
      state.ball.defaultBall = getDefaultBall(canvSize.h);

      //console.log(`[pong.tsx] on ball received: x: ${ball.x}, y: ${ball.y} dirX: ${ball.dir.x} dirY: ${ball.dir.y} rad: ${ball.rad} velocity: ${ball.velocity}`);

      //console.log(`[pong.tsx] received ball rad: ${ball.rad}, normalized: ${state.ball.rad} (${ball.rad} * ${canvSize.h} / ${canvasHeight})`);

      if (received === (Received.STATUS | Received.PLAYERS | Received.SCORES)) {
        received = 0;
        // console.log(`[pong.tsx] render frame: Id: ${animationId}`);
        if (animationId !== undefined) {
          if (state.status === GameStatus.RUNNING) {
            animationId = requestAnimationFrame(frame);
          } else {
            // console.log(`[pong.tsx] Cancel animation frame, game status ${state.status}`);
            cancelAnimationFrame(animationId);
            animationId = undefined;
          }
        }
      }
    };

    const onMatchStart = () => {
      console.log("[pong.tsx] Game has started");
      appSocket?.emit(Events.Server.StartGame, { roomId: match.params.id });
    };

    const onMatchEnd = () => {
      console.log("[pong.tsx] Game is finished");
      appSocket?.emit(Events.Server.EndGame, { room: match.params.id });
    };

    const deleteSubscribedListeners = () => {
      if (updateIntervalHandle) {
        clearInterval(updateIntervalHandle);
      }
      matchSocket
        ?.off(ClientMessages.JOINED, onJoined)
        //.off(ClientMessages.RECEIVE_ST, onReceiveGameStatus)
        .off(ClientMessages.RECEIVE_STATUS, onReceiveStatus)
        .off(ClientMessages.RECEIVE_PLAYERS, onReceivePlayers)
        .off(ClientMessages.RECEIVE_SCORES, onReceiveScores)
        .off(ClientMessages.RECEIVE_BALL, onReceiveBall)
        .off(ClientMessages.QUIT, onQuit)
        .off(ClientMessages.GAME_START, onMatchStart)
        .off(ClientMessages.GAME_END, onMatchEnd);

      window.removeEventListener("mousemove", mouseEventHandler);
    };

    const frame = () => {
      //pongEngine(state, canvSize.h);
      renderize(state, ctx.current!, canvSize.h);
      requestAnimationFrame(frame);
    };

    updateIntervalHandle = setInterval(() => {
      //console.log(`[pong.tsx] ball rad: ${state.ball.rad}`);
      pongEngine(state, canvSize.h);
    }, 3);

    matchSocket
      ?.on(ClientMessages.JOINED, onJoined)
      //.on(ClientMessages.RECEIVE_ST, onReceiveGameStatus)
      .on(ClientMessages.RECEIVE_STATUS, onReceiveStatus)
      .on(ClientMessages.RECEIVE_PLAYERS, onReceivePlayers)
      .on(ClientMessages.RECEIVE_SCORES, onReceiveScores)
      .on(ClientMessages.RECEIVE_BALL, onReceiveBall)
      .on(ClientMessages.QUIT, onQuit)
      .on(ClientMessages.GAME_START, onMatchStart)
      .on(ClientMessages.GAME_END, onMatchEnd);

    //matchSocket?.emit("test", { id: Number(match.params.id) });
    matchSocket?.emit(ServerMessages.JOIN_ROOM, { id: Number(match.params.id) });

    return deleteSubscribedListeners;
  }, [user?.id, matchSocket, appSocket, history, match.params.id,
  canvSize.h
  ]);

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  const quitGame = () => {
    setGiveUpDisplay(false);
    closeModal();
    history.push('/game');
  }

  const [giveUpDisplay, setGiveUpDisplay] = useState(false);

  const displayGiveUpButton = () => {
    if (!giveUpDisplay) {
      return (
        <button
          className={buttonClassname + " bg-red-600 hover:bg-red-700"}
          onClick={() => setGiveUpDisplay(true)}
          disabled={giveUpDisplay}
        >
          <span className={textButtonClassname}>Give up</span>
        </button>
      )
    }
  }

  const displayGiveUpConfirmationButton = () => {
    if (giveUpDisplay) {
      return (
        <div className='flex space-x-8'>
          <button
            className={buttonClassname + " bg-red-600 hover:bg-red-700"}
            onClick={quitGame}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>Give up, really?</span>
          </button>
          <button
            className={buttonClassname + " bg-secondary hover:bg-secondary-dark w-12"}
            onClick={() => setGiveUpDisplay(false)}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>No</span>
          </button>
        </div>
      )
    }
  }

  const buttonClassname =
    "flex justify-center rounded-lg py-2 px-2 h-8 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap" +
    " items-center my-2";
  const textButtonClassname = "text-lg font-bold text-gray-900";

  const displayMatchSearch = () => {
    return (
      <div>
        <Popup open={open} closeOnDocumentClick onClose={quitGame}>
          <div className=" fixed top-0 left-0 z-30 overflow-auto bg-gray-700 flex w-screen h-screen bg-opacity-70">
            <div className=' bg-red-500 h-12'>
              <div className="fixed top-0 left-0 z-50 w-full justify-center grid">
                {displayGiveUpButton()}
                {displayGiveUpConfirmationButton()}
              </div>
              <div className='fixed top-0 left-0 z-40  w-screen h-screen pb-16/9'>
                <div className=' mt-12 w-screen grid justify-center'>

                  <canvas
                    ref={canvasRef}
                    // height='450'
                    // width='800'
                    height={canvSize.h}
                    width={canvSize.w}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    );
  };

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  return (
    displayMatchSearch()
  );
}
