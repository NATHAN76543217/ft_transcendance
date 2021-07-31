import { useContext, useEffect, useRef } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { GameContext } from "../context";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import {canvasHeight, canvasWidth } from "../../../models/game/canvasDims"

export type PongPageParams = {
  id: string;
};

export function Pong({ match }: RouteComponentProps<PongPageParams>) {
  const { user } = useContext(AppContext);
  const gameContext = useContext(GameContext);
  const history = useHistory();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (
      gameContext.gameSocket === undefined ||
      canvasRef.current === null ||
      ctx.current === null
    )
      return;

    let state: GameState;
    let animationId: number | undefined = undefined;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;

    const onJoined = (data: GameJoinedDto) => {
      if (data.role === GameRole.Player) {
        canvasRef.current!.addEventListener("mousemove", (event: any) => {
          const rect = canvasRef.current!.getBoundingClientRect();

          const player = state.players.find((player) => player.id === user?.id);

          if (player) {
            player.y = event.clientY - rect.top - player.height / 2;
          }

          gameContext.gameSocket?.volatile.emit(
            ServerMessages.UPDATE_MOUSE_POS,
            {
              x: event.clientX,
              y: event.clientY, // TO DO: or event.clientY - rect.top - player.height / 2; ?!?!
            }
          );
        });
      }
    };

    const onQuit = () => {
      history.push('/game');
    };

    const onReceiveGameStatus = (st: GameState) => {
      state = st;
      if (animationId !== undefined) {
        if (state.status === GameStatus.RUNNING) {
          animationId = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(animationId);
          animationId = undefined;
        }
      }
    };

    const deleteSubscribedListeners = () => {
      if (updateIntervalHandle) {
        clearInterval(updateIntervalHandle);
      }
      gameContext.gameSocket?.off(
        ClientMessages.RECEIVE_ST,
        onReceiveGameStatus
      ).off(ClientMessages.QUIT, onQuit);
    };

    const frame = () => {
      renderize(state, ctx.current!);
      requestAnimationFrame(frame);
    };

    updateIntervalHandle = setInterval(() => {
      pongEngine(state);
    }, 60 * 1000);

    gameContext.gameSocket
      ?.on(ClientMessages.JOINED, onJoined)
      .on(ClientMessages.RECEIVE_ST, onReceiveGameStatus)
      .on(ClientMessages.QUIT, onQuit);

    gameContext.gameSocket?.emit(ServerMessages.JOIN_ROOM, Number(match.params.id));

    return deleteSubscribedListeners;
  }, [user?.id, gameContext.gameSocket]);

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  const height : number = canvasRef.current?.height as number;
  return (
    <div>
      <canvas ref={canvasRef} height={height} width={(canvasWidth * height) / canvasHeight } className="" />;
    </div>
  );
}
