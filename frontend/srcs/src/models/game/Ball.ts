import { canvasWidth, canvasHeight } from "./canvasDims";
import { IPlayer } from "./Player";
import { IVector2D, Vector2D } from "./Vector2D";

export interface IBallBase extends IVector2D {
  dir: Vector2D;
  velocity: number;
  rad: number;
}

export interface IBall extends IBallBase {
  defaultBall : IBallBase
}

export class Ball extends Vector2D implements IBallBase {
  defaultBall: IBallBase;

  constructor(
    pos: IVector2D,
    public dir: Vector2D,
    public velocity: number,
    public rad: number
  ) {
    super(pos.x, pos.y);
    this.defaultBall = this;
  }

  isColiding(player: IPlayer): boolean {
    return (
      player.x < this.x + this.rad &&
      player.y < this.y + this.rad &&
      player.x + player.width > this.x - this.rad &&
      player.y + player.height > this.y - this.rad
    );
  }

  rebound(player: IPlayer, currCanvHeight: number) {
    // Change the ball direction (rebound)
    const normAngle: number =
      ((this.y - (player.y + player.height / 2)) / player.height / 2) *
      (Math.PI / 4);
    const sense: number = this.x + this.rad < ((canvasWidth * currCanvHeight) / canvasHeight) / 2 ? 1 : -1;
    this.dir.x = sense * this.velocity * Math.cos(normAngle);
    this.dir.y = this.velocity * Math.sin(normAngle);

    this.velocity += 0.1;
  }
}

export const defaultBall: Ball = new Ball(
  new Vector2D(canvasWidth / 2, canvasHeight / 2),
  new Vector2D(5, 5),
  7,
  42
);
