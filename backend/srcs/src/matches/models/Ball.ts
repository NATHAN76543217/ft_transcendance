import { canvasDims } from './canvasDims';
import { IVector2D, Vector2D } from './Vector2D';

export interface IBallBase extends IVector2D {
  dir: Vector2D;
  velocity: number;
  rad: number;
}

export class Ball extends Vector2D implements IBallBase {
  public defaultBall: IBallBase;

  constructor(
    pos: IVector2D,
    public dir: Vector2D,
    public velocity: number,
    public rad: number,
  ) {
    super(pos.x, pos.y);
    this.defaultBall = this;
  }
}

export const defaultBall: Ball = new Ball(
  new Vector2D(canvasDims.x / 2, canvasDims.y / 2),
  new Vector2D(5, 5),
  7,
  10,
);
