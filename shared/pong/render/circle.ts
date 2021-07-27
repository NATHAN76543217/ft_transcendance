import {
    ICircle,
    Circle
} from "../shapes/circle"
import {
    IVector2D
} from "../shapes/vector2d";
import {
    AStyle
} from "./style"

export interface ICircleRender extends ICircle
{
    style : AStyle;
    draw(ctx : any) : void;
}

export class CircleRender extends Circle implements ICircleRender
{
    constructor(
        pos : IVector2D,
        rad : number,
        public style : AStyle
    ) { super(pos, rad); }

    private static wrappedDraw(ctx : any, circle : ICircleRender)
	{
		circle.style.apply(ctx);
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

	public draw(ctx : any) : void
	{ CircleRender.wrappedDraw(ctx, this); }
}
