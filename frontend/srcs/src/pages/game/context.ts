import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import { Ball } from "../../models/game/Ball";
import { IPlayer } from "../../models/game/Player";
import { Ruleset } from "../../models/game/Ruleset.dto";
import { IVector2D, Vector2D } from "../../models/game/Vector2D";
import { Action } from "./pages/game";

const canvasDims: IVector2D = {
  x: 1600,
  y: 900,
};

const defaultBall: Ball = new Ball(
  new Vector2D(canvasDims.x / 2, canvasDims.y / 2),
  new Vector2D(5, 5),
  7,
  10
);

export type GameState = {
  players: Map<Number, IPlayer>;
  ball: Ball;
};

export interface IGameContext {
  gameSocket?: Socket;
  ruleset: Ruleset;
  rulesSetDispatch?: React.Dispatch<{ type: Action }>;
  state: GameState;
  stateDispatch?: React.Dispatch<{ type: Action }>;
  playerIds: number[];
  playerIdsDispatch?: React.Dispatch<{ type: Action }>;
}

export const defaultRuleset: Ruleset = {
  duration: 3,
  rounds: 11,
};

export const defaultGameState: GameState = {
  players: new Map(),
  ball: defaultBall,
};

export const GameContext = createContext<IGameContext>({
  ruleset: defaultRuleset,
  state: defaultGameState,
  playerIds: [],
});
