import {
    Vector2D,
    IVector2D
} from "./vector2d"

export interface ICircle extends IVector2D 
{
    rad : number;
}

export class Circle extends Vector2D implements ICircle
{
    constructor(
        pos : IVector2D,
        public rad : number
    ) { super(pos.x, pos.y); }

}
