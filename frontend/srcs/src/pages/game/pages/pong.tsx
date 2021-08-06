import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { getDefaultBall, pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import { canvasHeight, whRatio } from "../../../models/game/canvasDims";
import { Events } from "../../../models/channel/Events";
import { Player } from "../../../models/game/Player";
import { Ball, IBall } from "../../../models/game/Ball";
import Popup from "reactjs-popup";
import { ruleOfThree } from "../engine/engine"
import { GameResults } from "../../../models/game/GameResults";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Loading from "../../../components/loading/loading";

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

  const [gameFinished, setGameFinished] = useState(false);
  const [waitingScreen, setWaitingScreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const widthMargin = 50;

  const [finalData, setFinalData] = useState<GameResults>({
    playersId: [0, 0],
    scores: [0, 0],
    playersName: ['', '']
  });

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

  console.log(`[pong.tsx] Canvas size x: ${canvSize.w} y: ${canvSize.h}`);

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
        setWaitingScreen(true);
      }
      else
        setWaitingScreen(false);
    };

    const onQuit = () => {
      // matchSocket?.emit(ServerMessages.PLAYER_GIVEUP);
      // history.push("/game");
    };

    const onReceiveStatus = (status: GameStatus) => {
      state.status = status;
      received |= Received.STATUS;
    };

    const onReceivePlayers = (players: Player[]) => {

      players.forEach((player) => {
        player.y = ruleOfThree(player.y, canvSize.h);
        player.x = ruleOfThree(player.x, canvSize.h);
        player.height = ruleOfThree(player.height, canvSize.h);
        player.width = ruleOfThree(player.width, canvSize.h);
      });

      state.players = players;
      received |= Received.PLAYERS;
    };

    const onReceiveScores = (scores: number[]) => {
      state.scores = scores;
      received |= Received.SCORES;
    };

    const onReceiveBall = (ball: IBall) => {
      state.ball = new Ball(
        {
          x: ruleOfThree(ball.x, canvSize.h),
          y: ruleOfThree(ball.y, canvSize.h)
        },
        {
          x: ruleOfThree(ball.dir.x, canvSize.h),
          y: ruleOfThree(ball.dir.y, canvSize.h)
        },
        Math.max(ruleOfThree(ball.rad, canvSize.h), 7),
        ruleOfThree(ball.velocity, canvSize.h)
      );

      state.ball.defaultBall = getDefaultBall(canvSize.h);

      // TO DO: This is a temporally solution ! Shold not need this line !!!
      state.ball.rad = state.ball.defaultBall.rad;

      if (received === (Received.STATUS | Received.PLAYERS | Received.SCORES)) {
        received = 0;
        if (animationId !== undefined) {
          if (state.status === GameStatus.RUNNING) {
            animationId = requestAnimationFrame(frame);
          } else {
            console.log(`Cancel animation frame ${animationId}`);
            cancelAnimationFrame(animationId);
            if (state.status === GameStatus.FINISHED) {
              clearInterval(updateIntervalHandle!);
            }
            animationId = undefined;
          }
        }
      }
    };

    const onMatchStart = () => {
      console.log("[pong.tsx] Game has started");
      appSocket?.emit(Events.Server.StartGame, { roomId: match.params.id });
      setWaitingScreen(false);
      updateIntervalHandle = setInterval(() => {
        //console.log(`[pong.tsx] ball rad: ${state.ball.rad}`);
        pongEngine(state, canvSize.h);
      }, 3);
    };

    const setEndGameData = async (
      winnerIndex: number,
    ) => {
      try {
        setFinalData({
          playersId: [state.players[winnerIndex].id, state.players[1 - winnerIndex].id],
          scores: [state.scores[winnerIndex], state.scores[1 - winnerIndex]],
          playersName: ['', '']
        })
      } catch (error) { console.log(error) }
    };

    // const onMatchEnd = async (data: { playerNames: string[] }) => {
    const onMatchEnd = async () => {
      console.log("[pong.tsx] Game is finished - state: ", state);
      const winnerIndex = state.scores[0] >= state.scores[1] ? 0 : 1
      // await setEndGameData(winnerIndex, data.playerNames);
      await setEndGameData(winnerIndex);
      setGameFinished(true);
      appSocket?.emit(Events.Server.EndGame, { room: match.params.id });
    };

    const deleteSubscribedListeners = () => {
      if (updateIntervalHandle) {
        clearInterval(updateIntervalHandle);
      }
      matchSocket
        ?.off(ClientMessages.JOINED, onJoined)
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
      renderize(state, ctx.current!, canvSize.h);
      requestAnimationFrame(frame);
    };

    // updateIntervalHandle = setInterval(() => {
    //   //console.log(`[pong.tsx] ball rad: ${state.ball.rad}`);
    //   pongEngine(state, canvSize.h);
    // }, 3);

    matchSocket
      ?.on(ClientMessages.JOINED, onJoined)
      .on(ClientMessages.RECEIVE_STATUS, onReceiveStatus)
      .on(ClientMessages.RECEIVE_PLAYERS, onReceivePlayers)
      .on(ClientMessages.RECEIVE_SCORES, onReceiveScores)
      .on(ClientMessages.RECEIVE_BALL, onReceiveBall)
      .on(ClientMessages.QUIT, onQuit)
      .on(ClientMessages.GAME_START, onMatchStart)
      .on(ClientMessages.GAME_END, onMatchEnd);

    matchSocket?.emit(ServerMessages.JOIN_ROOM, { id: Number(match.params.id) });

    return deleteSubscribedListeners;
  }, [user?.id, matchSocket, appSocket, history, match.params.id,
  canvSize.h
  ]);

  useEffect(() => {
    const setPlayerNamesData = async () => {
      if (!finalData.playersName[0] || !finalData.playersName[0].length) {
        try {
          const data0 = await axios.get("/api/users/" + finalData.playersId[0]);
          const data1 = await axios.get("/api/users/" + finalData.playersId[1]);
          setFinalData({
            ...finalData,
            playersName: [data0.data.name, data1.data.name]
          })
        } catch (error) { console.log(error) }
      }
    }
    setPlayerNamesData()
  }, [finalData])

  // useEffect(() => {
  //   console.log('useEffect - gameFinished', gameFinished)
  // }, [gameFinished])

  // useEffect(() => {
  //   console.log('useEffect - waitingScreen', waitingScreen)
  // }, [waitingScreen])

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  const quitGame = () => {
    setGiveUpDisplay(false);
    closeModal();
    // history.push('/game');
  }

  const giveUpGame = () => {
    matchSocket?.emit(ServerMessages.PLAYER_GIVEUP);
    setGiveUpDisplay(false);
    closeModal();
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
            onClick={giveUpGame}
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


  const displayWaitingScreen = () => {
    if (waitingScreen) {
      return (
        <div className='fixed top-12 left-0 z-50 w-screen h-screen bg-gray-700 opacity-70'>
          <div className='w-72 h-32 bg-primary rounded-md grid justify-center mt-12'>
            <span className="font-bold text-xl mb-2 mt-4">
              Waiting for the game...
            </span>
            <Loading hideText />
          </div>
        </div>
      )
    }
  }

  const displayCanvas = () => {
    // if (!waitingScreen) {
    return (
      <canvas
        ref={canvasRef}
        height={canvSize.h}
        width={canvSize.w}
        className="w-full"
      // hidden={waitingScreen}
      />
    )
    // }
  }

  const displayGame = () => {
    return (
      <div>
        <Popup open={open} closeOnDocumentClick onClose={giveUpGame}>
          <div className=" fixed top-0 left-0 z-30 overflow-auto bg-gray-700 flex w-screen h-screen bg-opacity-70">
            <div className=' bg-red-500 h-12'>
              <div className="fixed top-0 left-0 z-50 w-full justify-center grid">
                {displayGiveUpButton()}
                {displayGiveUpConfirmationButton()}
              </div>
              {displayWaitingScreen()}
              <div className='fixed top-0 left-0 z-40  w-screen h-screen pb-16/9'>
                <div className=' mt-12 w-screen grid justify-center'>
                  {displayCanvas()}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </div >
    );
  };

  const displayWinOrLosePicture = () => {
    const path = finalData.playersId[1] === user?.id
      ? "/api/uploads/lose.png"
      : "/api/uploads/win.png";
    return (
      <img
        className="object-contain w-32 h-full"
        src={path}
        alt="win or lose"
      />
    )
  }

  const displayScores = () => {
    if (finalData.scores[1] === -1) {
      return (
        <div className="flex justify-center text-center mb-8 text-2xl font-bold md:text-3xl break-words">
          Forfeit
        </div>
      )
    } else {
      return (
        <div className="flex justify-center text-center mb-8 text-2xl font-bold md:text-3xl break-words">
          Scores:
          <br />
          {finalData.scores[0]} - {finalData.scores[1]}
        </div>
      )
    }
  }

  const displayFinishedBoard = () => {
    return (
      <div className='grid justify-center'>
        <div className="inline-block w-72 max-w-sm px-2 py-8 mt-16 mb-8 border-2 border-gray-300 rounded-lg bg-neutral md:px-12 md:max-w-lg">
          <div className="flex justify-center text-center mb-4 text-2xl font-bold md:text-3xl break-words">
            Winner
            <br />
            {finalData.playersName[0]}
          </div>
          {displayScores()}
          <div className="flex w-auto justify-center space-x-8 rounded-md lg:space-x-24">
            {displayWinOrLosePicture()}
          </div>
          <div className="flex justify-center ">
            <NavLink
              className={
                buttonClassname +
                " bg-secondary hover:bg-secondary-dark mt-8 w-32"
              }
              to="/game"
              onClick={() => history.push("/game")}
            >
              <span className={textButtonClassname}>Quit</span>
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  if (!gameFinished) {
    return (
      displayGame()
    );
  } else {
    return (
      displayFinishedBoard()
    )
  }
}
