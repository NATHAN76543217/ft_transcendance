import {
    IVector2D,
    Vector2D
} from "../shapes/vector2d"

export declare class IScore extends Vector2D
{
    private wrappedPoints : number;
    public color : string;
    public font : string;
    public scorePoint() : void;
    get points();
}

export class Score extends Vector2D
{
    private wrappedPoints : number = 0;
    public color : string;
    public font : string;

    get points() { return this.wrappedPoints; }

    constructor(other : IScore);
    constructor(pos : Vector2D,color : string, font : string);
    constructor(
        polimorph : Vector2D | IScore,
        color? : string,
        font? : string
    )
    {
        super(polimorph.x, polimorph.y);
        this.color = polimorph instanceof IScore ? polimorph.color : color;
        this.font = polimorph instanceof IScore ? polimorph.font : font;
    }

    public scorePoint()
    { this.wrappedPoints++; }

    private static wrappedDraw(ctx : any, score : Score) : void
	{
		ctx.fillStyle = score.color;
		ctx.font = score.font;
		ctx.fillText(score.points, score.x, score.y);
	}

	public draw(ctx : any) : void
	{ Score.wrappedDraw(ctx, this); }
}
