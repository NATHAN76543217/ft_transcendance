import { PlayerStatus } from '../dto/playerStatus';
import { IVector2D, Vector2D } from './Vector2D';

export type Side = 'left' | 'right';

export const PLAYER_WIDTH: number = 10;
export const PLAYER_HEIGHT: number = 100;
export interface IPlayer extends IVector2D {
  width: number;
  height: number;
  status: PlayerStatus;
  side?: Side;
  id: number;
}
export class Player extends Vector2D implements IPlayer {
  width: number = PLAYER_WIDTH;
  height: number = PLAYER_HEIGHT;
  constructor(
    pos: IVector2D,
    public side: Side,
    public status: PlayerStatus,
    public id: number,
  ) {
    super(pos.x, pos.y);
  }
}
