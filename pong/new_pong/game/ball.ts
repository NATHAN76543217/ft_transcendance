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

export interface IBall extends ICircleRender
{
    velocity : IVector2D;
    speed : number;
    defaultBall : ICircle
}

export class Ball extends CircleRender implements IBall
{
    constructor(
        pos : IVector2D,
        rad : number,
        style : AStyle,
        public velocity : IVector2D,
        public speed : number,
        public readonly defaultBall : ICircle
    )
    { super(pos, rad, style); }
}
