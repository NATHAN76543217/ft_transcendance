/**
 *  @file "pong_engine/customization.ts"
 * 
 *  @brief Defines all style customization stuff.
*/

/**
 *	@brief Represent a color or texture.
 *	@member data A string representing a color or a texture file.
 *	@method apply A function that will apply color to some object.
*/
export abstract class AStyle
{
	constructor(public data : string)
	{ this.data = data; }

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

export enum Direction
{
	VERTICAL,
	HORIZONAL
}