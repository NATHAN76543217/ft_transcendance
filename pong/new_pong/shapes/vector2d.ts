
export interface IVector2D
{
    x : number;
    y : number;
    add(other : IVector2D);
    sub(other : IVector2D);
    mul(scale : number);
    div(scale : number);
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
}