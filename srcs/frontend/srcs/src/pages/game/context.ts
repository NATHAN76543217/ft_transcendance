import { Ruleset } from "../../models/game/Ruleset.dto";
import { defaultBall } from "../../models/game/Ball";
import { GameState, GameStatus } from "../../models/game/GameState";

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
