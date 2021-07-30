import { Ruleset } from '../dto/ruleset.dto';
import { Ball } from './Ball';
import { Player } from './Player';

export enum GameStatus {
  UNREADY,
  STARTING,
  RUNNING,
  PAUSED,
  FINISHED,
}

export type GameState = {
  elapsed: number;
  status: GameStatus;
  players: Map<number, Player>;
  scores: number[];
  ball: Ball;
};

export type GameRoom = {
  lastRunning?: number;
  matchId: number;
  ruleset: Ruleset;
  state: GameState;
  /** List of players that have been invited to the room. */
  playerIds: number[];
};
