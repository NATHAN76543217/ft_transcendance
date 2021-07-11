import {
    RectangleRender,
    IRectangleRender
} from "../render/rectangle"
import {
    IVector2D,
    Vector2D
} from "../shapes/vector2d"
import {
    AStyle
} from "../render/style"
import {
    Score,
    IScore
} from "./score"

interface IPaddle extends IRectangleRender
{
    limitLeft : Vector2D;
    limitRight : Vector2D;
}

class Paddle extends  RectangleRender implements IRectangleRender
{
    constructor(
        pos : Vector2D,
        width : number,
        height : number,
        style : AStyle,
        public readonly limitLeft : Vector2D,
        public readonly limitRight : Vector2D
    ) { super(pos, width, height, style); }
}

export declare class IPlayer implements Partial<IPaddle>
{
    x : number;
    y : number;
    width : number;
    height : number;
    style : AStyle;
    limitLeft : Vector2D;
    limitRight : Vector2D
    score : Score;
    id : string;
    draw(ctx : any) : void;
}

export class Player extends Paddle implements IPlayer
{
    public readonly score : Score
    public id : string

    constructor(pos : IVector2D, width : number, height : number, style : AStyle,
        limitLeft : IVector2D, limitRight : IVector2D, score : Score, id : string);
    constructor(other : IPlayer);
    constructor(
        polimorph : IVector2D | IPlayer, width? : number, height? : number, style? : AStyle,
        limitLeft? : IVector2D, limitRight? : IVector2D, score? : Score, id? : string
    )
    {
        super(
            polimorph instanceof IPlayer ? new Vector2D(polimorph.x, polimorph.y) : polimorph,
            polimorph instanceof IPlayer ? polimorph.width : width,
            polimorph instanceof IPlayer ? polimorph.height : height,
            polimorph instanceof IPlayer ? polimorph.style : style,
            polimorph instanceof IPlayer ? polimorph.limitLeft : limitLeft,
            polimorph instanceof IPlayer ? polimorph.limitRight : limitRight
        );

        this.score = polimorph instanceof IPlayer ? polimorph.score : score;
        this.id = polimorph instanceof IPlayer ? polimorph.id : id;
    }
}
