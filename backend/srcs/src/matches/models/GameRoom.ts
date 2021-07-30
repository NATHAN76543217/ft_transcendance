import { Ruleset } from '../dto/ruleset.dto';
import { Ball } from './Ball';
import { IPlayer } from './Player';

export type GameState = {
  players: Map<number, IPlayer>;
  ball: Ball;
};

export type GameRoom = {
  ruleset: Ruleset;
  state: GameState;
  /** List of players that have been invited to the room. */
  playerIds: number[];
};
