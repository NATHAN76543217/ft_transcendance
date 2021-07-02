import {
    Vector2D,
    IVector2D
} from "../shapes/vector2d"
import {
    AStyle
} from "../render/style"
import {
    CircleRender,
    ICircleRender
} from "../render/circle"
import {
    ICircle
} from "../shapes/circle"

export interface IDefaultBall extends IVector2D
{
    velocity : IVector2D;
    speed : number;
}

export interface IBall extends ICircleRender
{
    velocity : IVector2D;
    speed : number;
    defaultBall : IDefaultBall
}

export class Ball extends CircleRender implements IBall
{
    constructor(
        pos : IVector2D,
        rad : number,
        style : AStyle,
        public velocity : IVector2D,
        public speed : number,
        public readonly defaultBall : IDefaultBall
    )
    { super(pos, rad, style); }

    public reset()
    {
        this.x = this.defaultBall.x;
        this.y = this.defaultBall.y;
        this.velocity = this.defaultBall.velocity;
        this.speed = this.defaultBall.speed;
    }
}
