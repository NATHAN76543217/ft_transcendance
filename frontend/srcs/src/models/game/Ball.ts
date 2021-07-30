import { Vector2D } from "./Vector2D";

export interface IBallBase {
  pos: Vector2D;
  dir: Vector2D;
  velocity: number;
}

export class Ball implements IBallBase {
  public defaultBall: IBallBase;

  constructor(
    public pos: Vector2D,
    public dir: Vector2D,
    public velocity: number,
    public rad: number
  ) {
    this.defaultBall = this;
  }
}
