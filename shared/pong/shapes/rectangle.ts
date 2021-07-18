import {
    IVector2D,
    Vector2D
} from "./vector2d"

export interface IRectangle extends IVector2D
{
    width : number;
    height : number;
}

export class Rectangle extends Vector2D implements IRectangle
{
    constructor(
        pos : IVector2D,
        public width : number,
        public height : number
    ) { super(pos.x, pos.y); }
}
