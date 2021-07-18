import {
    IRectangle,
    Rectangle
} from "../shapes/rectangle"
import {
    Vector2D
} from "../shapes/vector2d"
import {
    AStyle
} from "./style"

export interface IRectangleRender extends IRectangle
{
    style : AStyle;
    draw(ctx : any) : void; 
}

export class RectangleRender extends Rectangle implements IRectangleRender
{
    constructor(
        pos : Vector2D,
        width : number,
        height : number,
        public style : AStyle
    ) { super(pos, width, height); }

    private static wrappedDraw(ctx : any, rectangle : IRectangleRender)
	{
		rectangle.style.apply(ctx);
		ctx.fillRect(rectangle.x, rectangle.y,
			rectangle.width, rectangle.height);
	}

	public draw(ctx : any) : void
	{ RectangleRender.wrappedDraw(ctx, this); }
}
