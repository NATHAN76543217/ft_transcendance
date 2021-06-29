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

    private static *generatePos(start : number, step : number, end : number) : Generator<number, void, unknown>
	{
		for ( ; start < end / step ; start++)
				yield start * step;
		// TO DO: IS THE GENERATOR REGENERED ?
	}

	private static wrappedDraw(ctx : any, courtWidth : number, net : Net) : void
	{
		for (const i of Net.generatePos(0, 15, courtWidth))
		{
			net.style.apply(ctx);
			const targetPos : IVector2D = new Vector2D(
				net.direction == Direction.VERTICAL ? net.x : net.x + i,
				net.direction == Direction.VERTICAL ? net.y + i : net.x);
			ctx.fillRect(targetPos.x, targetPos.y, net.width, net.height);
		}
	}

	public draw(ctx : any, courtWidth : number) : void
	{ Net.wrappedDraw(ctx, courtWidth, this); }
}