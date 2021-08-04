import { useContext, useEffect, useRef } from "react";
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
import { Player } from "../../../models/game/Player";
import { Ball, defaultBall, IBall } from "../../../models/game/Ball";
import { Vector2D } from "../../../models/game/Vector2D";

// TO DO: let animationId: number | undefined = undefined; IF NOT UNDEFINED -> LAUNCH RENDER

export type PongPageParams = {
  id: string;
};

enum Received {
  STATUS = 1 << 0,
  PLAYERS = Received.STATUS << 1,
  SCORES = Received.PLAYERS << 1,
  BALL = Received.SCORES << 1,
}

export function Pong({ match }: RouteComponentProps<PongPageParams>) {
  const { user, eventSocket: appSocket } = useContext(AppContext);
  const { matchSocket } = useContext(AppContext);
  const history = useHistory();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  console.log("[pong.tsx] Pong.tsx has been called");

  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");
  }, []);

  /* 

  useEffect(() => {
    canvasRef.current?.width = window.innerWidth;
  }, [window.innerWidth]) */

  useEffect(() => {
    console.log(canvasRef.current?.width);
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
      ball: {} as Ball,
    };
    let animationId: number | undefined = 0;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;

    const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return new Vector2D(
        (evt.clientX - rect.left) * scaleX,
        (evt.clientY - rect.top) * scaleY
      );
    };

    const mouseEventHandler = (event: MouseEvent) => {
      const player = state.players.find((player) => player.id === user?.id);

      if (player === undefined) return;
      const mousePos = getMousePos(canvasRef.current!, event);

      player.y = mousePos.y;

      // TO DO: Emit mouse pos only if mouse is in the canvas
      matchSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
        x: player.x,
        y: player.y,
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

    const onReceiveStatus = (status: GameStatus) => {
      console.log(`[pong.tsx] Received status: `, status);
      state.status = status;
      received |= Received.STATUS;
    };

    const onReceivePlayers = (players: Player[]) => {
      console.log(`[pong.tsx] Received players: }`, players);
      state.players = players;
      console.log(`[pong.tsx] User id: ${user?.id}`);
      state.players.forEach((player) =>
        console.log(`[pong.tsx] game registered player: ${player.id}`)
      );
      received |= Received.PLAYERS;
    };

    const onReceiveScores = (scores: number[]) => {
      console.log(`[pong.tsx] Received scores:`, scores);
      state.scores = scores;
      state.scores.forEach((score) =>
        console.log(`[pong.tsx] game score:`, score)
      );
      received |= Received.SCORES;
    };

    const onReceiveBall = (ball: IBall) => {
      console.log(`[pong.tsx] Received ball:`, ball);
      state.ball = new Ball(
        {
          x: ball.x,
          y: ball.y,
        },
        ball.dir,
        ball.velocity,
        ball.rad
      );
      state.ball.defaultBall = defaultBall;
      //state.ball = { ...ball, defaultBall: defaultBall as IBallBase } as Ball;
      //received |= Received.BALL;

      if (
        received ===
        (Received.STATUS |
          Received.PLAYERS |
          Received.SCORES) /* | Received.BALL*/
      ) {
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
      canvasRef.current?.removeEventListener("mousemove", mouseEventHandler);
    };

    const frame = () => {
      renderize(state, ctx.current!);
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
    matchSocket?.emit(ServerMessages.JOIN_ROOM, {
      id: Number(match.params.id),
    });

    return deleteSubscribedListeners;
  }, [user?.id, matchSocket, appSocket, history, match.params.id]);

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  return (
    <div className="">
      <canvas
        ref={canvasRef}
        height={canvasHeight}
        width={canvasWidth}
        className="w-full"
      />
    </div>
  );
}
