export abstract class AStyle
{
	constructor(
		public data : string
	) { }

	public abstract apply(ctx : any) : void;

	public static NumbertoHexStr(numeric : number) : string
	{ return "#"+ ('000000' + ((numeric)>>>0).toString(16)).slice(-6); }
}

export class ColorStyle extends AStyle
{
	constructor(color : string)
	{ super(color); }

	apply(ctx : any) : void
	{ ctx.fillStyle = this.data; }
}