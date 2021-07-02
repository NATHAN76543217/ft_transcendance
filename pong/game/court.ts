import {
    Vector2D
} from "../shapes/vector2d";
import {
    IRectangleRender,
    RectangleRender
} from "../render/rectangle";
import {
    AStyle
} from "../render/style";

export interface ICourt extends IRectangleRender
{
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    width : number;
    height : number;
    style : AStyle;
}

export class Court extends RectangleRender implements ICourt
{
    public readonly canvas : HTMLCanvasElement
    public readonly ctx : CanvasRenderingContext2D
    public readonly width : number
    public readonly height : number

    constructor(
        canvasId : string,
        public style : AStyle
    )
    {
        super(new Vector2D(0, 0), 0, 0, style);
        (this.canvas as HTMLElement) = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        super.width = this.canvas.clientWidth;
        super.height = this.canvas.clientHeight;
    }
}