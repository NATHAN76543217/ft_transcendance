import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { GameContext } from "../context";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";

export type PongPageParams = {
  id: string;
};

export function Pong({ match }: RouteComponentProps<PongPageParams>) {
  const { user } = useContext(AppContext);
  const gameContext = useContext(GameContext);

  const canvasId: string = "pongCanvas";

  const canvas: HTMLCanvasElement | null = document.getElementById(
    canvasId
  ) as HTMLCanvasElement;
  if (canvas === null) throw new Error(); // TO DO
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx === null) throw new Error(); // TO DO

  let state: GameState;

  let animationId: number | undefined = undefined;

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

  const onJoined = (data: GameJoinedDto) => {
    if (data.role === GameRole.Player) {
      canvas.addEventListener("mousemove", (event: any) => {
        const rect = canvas.getBoundingClientRect();

        const player = state.players.find((player) => player.id === user?.id);

        if (player) {
          player.y = event.clientY - rect.top - player.height / 2;
        }

        gameContext.gameSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
          x: event.clientX,
          y: event.clientY,
        });
      });
    }
  };

  const deleteSubscribedListeners = () => {
    if (gameContext.gameSocket)
      gameContext.gameSocket.off(
        ClientMessages.RECEIVE_ST,
        onReceiveGameStatus
      );
  };

  useEffect(() => {
    gameContext.gameSocket
      ?.on(ClientMessages.JOINED, onJoined)
      .on(ClientMessages.RECEIVE_ST, onReceiveGameStatus);
    return deleteSubscribedListeners;
  }, [gameContext.gameSocket]);

  setInterval(() => {
    pongEngine(state);
  }, 60 * 1000);

  const frame = () => {
    renderize(state, ctx);
    requestAnimationFrame(frame);
  };

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

  // TO DO: Impose a size using canvasDims
  return <canvas id={canvasId} className="" />;
}
