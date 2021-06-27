import {
    Vector2D,
    IVector2D
} from "../shapes/vector2d"
import {
    AStyle
} from "../render/style"
import {
    Rectangle
} from "../shapes/rectangle"

export enum Direction
{
    HORIZONTAL,
    VERTICAL
};

export declare class INet
{
    public readonly x : number;
    public readonly y : number;
	public readonly width : number;
	public readonly height : number;
	public readonly style : AStyle;
	public readonly direction : Direction;
}

export class Net extends Rectangle implements INet
{
    public style : AStyle
    public readonly direction : Direction

    constructor(pos : IVector2D, width : number, height : number, style : AStyle,
        direction : Direction);
    constructor(other : INet);
    constructor(
        polimorph : IVector2D | INet,
        width? : number,
        height? : number,
        style? : AStyle,
        direction? : Direction
    )
    {
        super(
            new Vector2D(polimorph.x, polimorph.y),
            polimorph instanceof INet ? polimorph.width : width,
            polimorph instanceof INet ? polimorph.height : height
        );
        this.style = polimorph instanceof INet ? polimorph.style : style;
        this.direction = polimorph instanceof INet ? polimorph.direction : direction;
    }
}