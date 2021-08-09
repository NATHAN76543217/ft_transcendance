import { Ball } from "./Ball";
import { IPlayer } from "./Player";

export enum GameStatus {
  UNREADY,
  STARTING,
  RUNNING,
  PAUSED,
  FINISHED,
}

export type GameState = {
  status: GameStatus;
  players: IPlayer[];
  scores: number[];
  ball: Ball;
};
