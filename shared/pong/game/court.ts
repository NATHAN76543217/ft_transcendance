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
import Unspected from "shared-pong/game/exceptions/unspected.exception"

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
    public readonly canvas : HTMLCanvasElement;
    public readonly ctx : CanvasRenderingContext2D;
    public readonly width : number;
    public readonly height : number;

    constructor(
        canvasId : string,
        public style : AStyle
    )
    {
        super(new Vector2D(0, 0), 0, 0, style);

        const canvas : HTMLElement | null = document.getElementById(canvasId);
        if (canvas && canvas != null)
            this.canvas = canvas as HTMLCanvasElement;
        else
            throw new Unspected("Court: canvas not found");
        const context : CanvasRenderingContext2D | null = this.canvas.getContext("2d");
        if (context && context != null)
            this.ctx = context;
        else
            throw new Unspected("Court: erronious context");
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
    }
}
