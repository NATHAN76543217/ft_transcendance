import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import { canvasHeight, canvasWidth } from "../../../models/game/canvasDims";
import { Events } from "../../../models/channel/Events";
import { IPlayer, Player } from "../../../models/game/Player";
import { Ball, defaultBall, IBall, IBallBase } from "../../../models/game/Ball";

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

  //console.log("[pong.tsx] Pong.tsx has been called");

  const [canvHeight, setCanvHeight] = useState<number>(window.innerHeight / 2);
  const [canvWidth, setCanvWidth] = useState<number>((canvasWidth * canvHeight) / canvasHeight);

  if (canvWidth > window.innerWidth) {
    setCanvHeight((canvasHeight * window.innerWidth) / canvasWidth);
    setCanvWidth((canvasWidth * canvHeight) / canvasHeight);
  }
  
  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");

    const windowResizeEventHandler = () => {
      //console.log("[pong.tsx] Resize screen");

      let h = window.innerHeight - (window.innerHeight / 2);
      let w = (canvasWidth * h) / canvasHeight;

      if (w > window.innerWidth) {
        h = (canvasHeight * window.innerWidth) / canvasWidth;
        w = (canvasWidth * h) / canvasHeight;
      }
      setCanvHeight(h);
      setCanvWidth(w);
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

    let received : number = 0;
    let state: GameState = {
      status: GameStatus.UNREADY,
      players: [],
      scores: [0, 0],
      ball: {} as Ball
    };
    let animationId: number | undefined = 0;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;

    const mouseEventHandler = (event: any) => {
      const rect = canvasRef.current!.getBoundingClientRect();

        const player = state.players.find((player) => player.id === user?.id);


        if (player) {
          player.y = event.clientY - rect.top - player.height / 2;
        }

        // TO DO: Emit mouse pos only if mouse is in the canvas
        matchSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
          x: event.clientX,
          y: event.clientY, // TO DO: rule of 3 to normalize mouse pos
        });
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

    // TO DO: Normalize mouse pos TOO !!!

    const ruleOfThree = (target: number) => {
      // Where y2 = (y1 * x2) / x1
      return (target * canvHeight) / canvasHeight;
    }

    const onReceiveStatus = (status : GameStatus) => {
      console.log(`[pong.tsx] Received status: ${status}`);
      state.status = status;
      received |= Received.STATUS;
    };

    const onReceivePlayers = (players : Player[]) => {
      //console.log(`[pong.tsx] Received players: ${players}`);

      players.forEach((player) => {
        player.y = ruleOfThree(player.y);
        console.log(`[pong.tsx] received player x is: ${player.x}`);
        player.x = ruleOfThree(player.x);
        player.height = ruleOfThree(player.height);
        player.width = ruleOfThree(player.width);
      });

      state.players = players;
      //console.log(`[pong.tsx] canvWidth: ${canvWidth}`);
      state.players.forEach((player) => console.log(`[pong.tsx] game registered player y: ${player.y} x: ${player.x} side: ${player.side} id: ${player.id} userId: ${user?.id}`));
      received |= Received.PLAYERS;
    };

    const onReceiveScores = (scores : number[]) => {
      //console.log(`[pong.tsx] Received scores: ${scores}`);
      state.scores = scores;
      state.scores.forEach((score) => console.log(`[pong.tsx] game score: ${score}`));
      received |= Received.SCORES;
    };

    const onReceiveBall = (ball : IBall) => {
      //console.log(`[pong.tsx] Received ball: ${ball}`);

      ball.x = ruleOfThree(ball.x);
      ball.y = ruleOfThree(ball.y);
      ball.dir.x = ruleOfThree(ball.dir.x);
      ball.dir.y = ruleOfThree(ball.dir.y);
      ball.rad = ruleOfThree(ball.rad);
      ball.velocity = ruleOfThree(ball.velocity);

      const tmpDefaultBall = { ...defaultBall };
      tmpDefaultBall.x = ruleOfThree(tmpDefaultBall.x);
      tmpDefaultBall.y = ruleOfThree(tmpDefaultBall.y);
      tmpDefaultBall.dir.x = ruleOfThree(tmpDefaultBall.dir.x);
      tmpDefaultBall.dir.y = ruleOfThree(tmpDefaultBall.dir.y);
      tmpDefaultBall.rad = ruleOfThree(tmpDefaultBall.rad);
      tmpDefaultBall.velocity = ruleOfThree(tmpDefaultBall.velocity);
      
      state.ball = new Ball({
        x: ball.x,
        y: ball.y
      }, ball.dir, ball.velocity, ball.rad);
      state.ball.defaultBall = tmpDefaultBall;
      //state.ball = { ...ball, defaultBall: defaultBall as IBallBase } as Ball;
      //received |= Received.BALL;

      if (received === (Received.STATUS | Received.PLAYERS
        | Received.SCORES/* | Received.BALL*/)) {
          received = 0;
          console.log(`[pong.tsx] render frame: Id: ${animationId}`);
          if (animationId !== undefined) {
            if (state.status === GameStatus.RUNNING) {
              animationId = requestAnimationFrame(frame);
            } else {
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
      renderize(state, ctx.current!, canvHeight);
      requestAnimationFrame(frame);
    };

    updateIntervalHandle = setInterval(() => {
      pongEngine(state);
    }, 60 * 1000);

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
  }, [user?.id, matchSocket, appSocket, history, match.params.id]);

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  return (
    <div className="">
      <canvas
        ref={canvasRef}
        height={canvHeight}
        width={canvWidth}
        className=""
      />
    </div>
  );
}
