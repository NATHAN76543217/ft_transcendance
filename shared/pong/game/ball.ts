import {
    Vector2D,
    IVector2D,
    IBaseVector2D
} from "../shapes/vector2d"
import {
    AStyle
} from "../render/style"
import {
    CircleRender,
} from "../render/circle"
import {
    Circle
} from "../shapes/circle"

export interface IDefaultBall
{
    x : number;
    y : number;
    velocity : IBaseVector2D;
    speed : number;
}

export declare class IBall extends Circle
{
    velocity : IVector2D;
    speed : number;
    style : AStyle;
    defaultBall : IDefaultBall
}

export class Ball extends CircleRender implements IBall
{
    public velocity : IVector2D
    public speed : number
    public readonly defaultBall : IDefaultBall

    constructor(
        pos : IVector2D,
        rad : number,
        style : AStyle,
        velocity : IVector2D,
        speed : number,
        defaultBall : IDefaultBall
    );

    constructor(
        other : IBall
    );

    constructor(
        polimorph : IVector2D | IBall,
        rad? : number,
        style? : AStyle,
        velocity? : IVector2D,
        speed? : number,
        defaultBall? : IDefaultBall
    )
    {
        super(
            polimorph.toVector2D(),
            polimorph instanceof IBall ? polimorph.rad : rad ? rad : 0,
            polimorph instanceof IBall ? polimorph.style : style ? style : {} as AStyle
        );

        this.velocity = polimorph instanceof IBall ? polimorph.velocity : velocity ? velocity : {} as IVector2D;
        this.speed = polimorph instanceof IBall ? polimorph.speed : speed ? speed : 0;
        this.defaultBall = polimorph instanceof IBall ? polimorph.defaultBall : defaultBall ? defaultBall : {} as IDefaultBall;
    }

    public reset()
    {
        this.x = this.defaultBall.x;
        this.y = this.defaultBall.y;
        this.velocity = this.defaultBall.velocity as IVector2D;
        this.speed = this.defaultBall.speed;
    }
}
