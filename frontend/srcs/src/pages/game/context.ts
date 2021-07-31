import { Ruleset } from "../../models/game/Ruleset.dto";
import { defaultBall } from "../../models/game/Ball";
import { GameState, GameStatus } from "../../models/game/GameState";
import { Socket } from "socket.io-client";
import { createContext } from "react";
export interface IGameContext {
  gameSocket?: Socket;
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

export const GameContext = createContext<IGameContext>({});
