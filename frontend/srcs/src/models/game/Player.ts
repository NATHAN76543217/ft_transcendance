import { PlayerStatus } from "./PlayerStatus";
import { Vector2D } from "./Vector2D";

export interface IPlayer {
  pos: Vector2D;
  width: number;
  height: number;
  status: PlayerStatus;
}
