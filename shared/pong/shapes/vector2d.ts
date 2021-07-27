
export interface IBaseVector2D
{
    x : number;
    y : number;
}

export interface IVector2D extends IBaseVector2D
{
    add(other : IVector2D) : void;
    sub(other : IVector2D) : void;
    mul(scale : number) : void;
    div(scale : number) : void;
    toVector2D() : IVector2D;
}

export class Vector2D implements IVector2D
{
    constructor(
		public x : number,
		public y : number
	) { }

    public add(other : IVector2D)
    {
        this.x += other.x;
        this.y += other.y;
    }

    public sub(other : IVector2D)
    {
        this.x -= other.x;
        this.y -= other.y;
    }

    public mul(scale : number)
    {
        this.x *= scale;
        this.y *= scale;
    }

    public div(scale : number)
    {
        this.x /= scale;
        this.y /= scale;
    }

    public toVector2D()
    { return this; }
}
