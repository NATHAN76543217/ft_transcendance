import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import { Ruleset } from "../../models/game/Ruleset.dto";
import { IVector2D } from "../../models/game/Vector2D";
import { defaultBall } from "../../models/game/Ball";
import { Action } from "./pages/game";
import { GameState, GameStatus } from "../../models/game/GameState";

export const canvasDims: IVector2D = {
  x: 1600,
  y: 900,
};

export interface IGameContext {
  gameSocket?: Socket;
  ruleset: Ruleset;
  rulesSetDispatch?: React.Dispatch<{ type: Action }>;
  playerIds: number[];
  playerIdsDispatch?: React.Dispatch<{ type: Action }>;
}

export const defaultRuleset: Ruleset = {
  duration: 3,
  rounds: 11,
};

export const defaultGameState: GameState = {
  scores: [0, 0],
  status: GameStatus.UNREADY,
  players: [],
  ball: defaultBall,
};

export const GameContext = createContext<IGameContext>({
  ruleset: defaultRuleset,
  playerIds: [],
});
