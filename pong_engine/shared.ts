
/**
 *	@file "pong_engine/shared.ts"
 *
 *	@brief Contains the implementation of shared objects between the
 *	pong engine (implemented at "pong_engine/engine.ts") and it's
 *	configuration file (implemented at "pong_engine/engine_congig.ts")
*/

// TO DO: Key controled paddle should have a velocity, need more spetialisation ...

//////////////////
// BASE OBSJETS //
//////////////////

/**
 *	@breif Represent a point in a 2 dimensional matrix.
 *	@member x A number type representing the vertical axis.
 *	@member y A number type representing horizontal axis.
*/

export class Point
{
	public x : number
	public y : number

	constructor(x : number, y : number)
	{
		this.x = x;
		this.y = y;
	}
}

/**
 *	@brief Represent a color or texture.
 *	@member data A string representing a color or a texture file.
 *	@method apply A function that will apply color to some object.
*/
export abstract class AStyle
{
	public data : string

	constructor(data : string)
	{
		this.data = data;
	}

	public abstract apply(ctx : any) : void;
}

/**
 *	@brief Represent a circle.
 *	@member pos A Point type representing the position of the circle
 *	@member rad A number type representnig the radius of the circle.
 *	@member style A Style type representing the visual style of the circle.
 *	@method draw A void funtion that draw the circle.
*/
class Circle
{
	public pos : Point
	public rad : number
	public style : AStyle

	constructor(pos : Point, rad : number, style : AStyle)
	{
		this.pos = pos;
		this.rad = rad;
		this.style = style;
	}

	private static wrappedDraw(ctx : any, circle : Circle)
	{
		circle.style.apply(ctx);
		ctx.beginPath();
		ctx.arc(circle.pos.x, circle.pos.y, circle.rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

	/// Must use canvas's context.
	public draw(ctx : any) : void
	{
		Circle.wrappedDraw(ctx, this);
	}
}

/**
 *	@brief Represent a rectangle.
 *	@member pos A Point type representing the postion
 *	@member width A number type representing the width of the rectangle.
 *	@member height A number type representing the height of the rectangle.
 *	@member style A Style type representing the visual style of the rectangle.
 *	@method collision A function that return a boolean type indicating if the
 *	ball collionated with the rectangle.
 *	@method draw A void funtion that draw the circle.
*/
class Rectangle
{
	public pos : Point
	public width : number
	public height : number
	public style : AStyle

	constructor(pos : Point, width : number, height : number, style : AStyle)
	{
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.style = style;
	}

	// Perhabs i need to specilise this one too !
	public thereIsCollision(ball : Circle) : boolean
	{
		return (this.pos.x < ball.pos.x + ball.rad // rectangle left < ball right
		&& this.pos.y < ball.pos.y + ball.rad // rectangle top < ball bottom
		&& this.pos.x + this.width > ball.pos.x - ball.rad // rectangle right > ball left
		&& this.pos.y + this.height > ball.pos.y - ball.rad); // rectangle bottom > ball top
	}

	private static wrappedDraw(ctx : any, rectangle : Rectangle)
	{
		rectangle.style.apply(ctx);
		ctx.fillRect(rectangle.pos.x, rectangle.pos.y,
			rectangle.width, rectangle.height);
	}

	public draw(ctx : any) : void
	{
		Rectangle.wrappedDraw(ctx, this);
	}
}

/**
 *	@brief Present a paddle (a mouving rectangle).
 *	@member limit_left A Point type representing the max letf slide point.
 *	@member limit_right A Point type representing the max right slide point.
 */
class Paddle extends Rectangle
{
	public readonly p_limit_left : Point
	public readonly p_limit_right : Point

	constructor(pos : Point, width : number, height : number, style : AStyle,
	limit_left : Point, limit_right : Point)
	{
		super(pos, width, height, style);
		this.p_limit_left = limit_left;
		this.p_limit_right = limit_right;
	}
}

///////////////////
// FINAL OBJECTS //
///////////////////

/**
 *	@brief Represents a player score.
 *	@member number A number representing the value of the score.
 *	@member color A string which is the color of the score.
 *	@member font A string which is the font of the score.
 *	NOTE: font must contain prepened the size of the font.
 *	@method draw Draw the score in the canvas.
*/
export class Score extends Point
{
	private score : number
	private color: string
	private font : string

	constructor(x : number, y : number, color : string, font : string)
	{
		super(x, y);
		this.score = 0;
		this.color = color;
		this.font = font;
	}

	public increaseScore()
	{
		this.score++;
	}

	private static wrappedDraw(ctx : any, score : Score) : void
	{
		ctx.fillStyle = score.color;
		ctx.font = score.font;
		ctx.fillText(score.score, score.x, score.y);
	}

	public draw(ctx : any) : void
	{
		Score.wrappedDraw(ctx, this);
	}
}

interface IPlayer
{
	pos : Point;
	width : number;
	height : number;
	style : AStyle;
	score : Score;
}

/**
 *	@brief Final class representing a player that constrols
 *	a paddle and has an score.
 *	@member score A Store type representing the score of the payer.
 *	@method scorePoint Fast typing: "this.score.score++;".
 */
export class Player extends Paddle implements IPlayer
{
	public readonly score : Score

	constructor(pos : Point, width : number, height : number, style : AStyle,
	limitLeft : Point, limitRight : Point, score : Score)
	{
		super(pos, width, height, style, limitLeft, limitRight);
		this.score = score;
	}

	public scorePoint() : void
	{
		this.score.increaseScore();
	}
}

/**
 *	@brief Represent the final object of the ball.
 *	@member velocity How fast the ball moves into frames.
 *	@member speed Also used to define how fast the ball moves.
 *	@method frontalRebound A function that reverses the ball's paddle
 *	to paddle dirrection.
 *	@method reset Put the ball on the middle of the court each
 *	time a player score.
 *	@method onLateralCollision A function that handle the ball direction when
 *	it collides in the court border.
*/
export abstract class ABall extends Circle
{
	public velocity : Point
	public speed : number
	private default : ABall

	constructor(pos : Point, rad : number, style : AStyle,
		velocity : Point, speed : number, dft : ABall)
	{
		super(pos, rad, style);
		this.velocity = velocity;
		this.speed = speed;
		this.default = dft;
	}

	public abstract wrappedFrontalRebound(ball : ABall);
	public abstract wrappedLateralRebound(ball : ABall);

	public frontalRebound() : void
	{
		this.wrappedFrontalRebound(this);
	}

	public lateralRebound() : void
	{
		this.wrappedLateralRebound(this);
	}

	public reset() : void
	{
		this.pos = this.default.pos;
		this.velocity = this.default.velocity;
		this.speed = this.default.speed;
		this.frontalRebound();
	}
}

/**
 *	@brief Represent the pong court (where the pong is played)
 *	@member canvas DOM object representing the court.
 *	@member ctx Graphic lib enbling to draw in the canvas.
 *	@member width Short version of "canvas.clientWidth".
 *	@member height Short version of canvas.clientHeight".
 *	@member slyle A Style type representing the visual style of the court.
 *	@method clear A void function that clear the canvas.
 *	@method onFrontalCollision A void function that increment the score of
 *	the player that scores a point.
 *	@method onLateralCollision A function that return a bool which indicates if
*	the ball hit the border of the court.
*/
export abstract class ACourt
{
	public readonly canvas : any
	public readonly ctx : any
	public readonly width : number
	public readonly height : number
	public style : AStyle

	constructor(canvas_name : string, style : AStyle)
	{
		this.canvas = document.getElementById(canvas_name);
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
		this.style = style;
	}

	public abstract wrappedFrontalCollision(court : ACourt) : void;
	public abstract wrappedLateralCollision(court : ACourt) : boolean;

	public onFrontalCollision() : void
	{
		// (player1 : Player, player2 : Player, ball : Circle) => void
		this.wrappedFrontalCollision(this);
	}

	public onLateralCollision() : boolean
	{
		// (ball : Circle) => boolean
		return this.wrappedLateralCollision(this);
	}

	public clear() : void
	{
		this.style.apply(this.ctx);
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
}

// HORIZONAL BORDER COLLISION
//check_border_collison(ball : Circle) : boolean
//{
//	return (ball.pos.y - ball.rad < 0 // ball collides on the top of the canvas
//	|| ball.pos.y + ball.rad > this.height); // ball collides on the bottom of the canvas
//}

export enum Direction
{
	VERTICAL,
	HORIZONAL
}

/**
 *	@brief Represents the net. Can be displayed horizontally or vertically.
 *	NOTE: Contains Rectangle members.
 *	@member direction A string that can be "vertical" or "horizonal" which
 *	represent the direction of the net.
 *	@method drawNet Draws the net following the given dirrection.
*/
export class Net extends Rectangle
{
	public readonly direction : Direction

	constructor(pos : Point, width : number, height : number, style : AStyle,
		direction : Direction)
	{
		super(pos, width, height, style);
		this.direction = direction;
		delete this.draw;
	}

	/**
	* @brief Generates a sequence start - end by steps distance.
	* @param start The start of the sequence.
	* @param step Distance between each generated value.
	* @param end The end of the sequence.
	* @yields Each step.
	*/
	private static *generatePos(start : number, step : number, end : number) // TO DO: Check return type
	{
		for ( ; start < end / step ; start++)
				yield start * step;
		// TO DO: IS THE GENERATOR REGENERED ?
	}

	private static wrappedDrawNet(ctx : any, courtWidth : number, net : Net) : void
	{
		for (const i of Net.generatePos(0, 15, courtWidth))
		{
			net.style.apply(ctx);
			const targetPos : Point = new Point(
				net.direction == Direction.VERTICAL ? net.pos.x : net.pos.x + i,
				net.direction == Direction.VERTICAL ? net.pos.y + i : net.pos.x);
			ctx.fillRect(targetPos.x, targetPos.y, net.width, net.height);
		}
	}

	public drawNet(ctx : any, courtWidth : number) : void
	{
		Net.wrappedDrawNet(ctx, courtWidth, this);
	}
}

/////////////////////////////////
// ENGINE CONFIGURATION OBJECT //
/////////////////////////////////

export interface IConfig
{
	court : ACourt
	player1 : Player
	player2 : Player
	ball : ABall
	net : Net
}

/**
 *	@brief Represents a range between 2 values in a 2
 *	dimensional axis.
 *	@member min Represent the lower limit.
 *	@member max Represent the greather limit.
*/
export class Range
{
	public readonly min : number
	public readonly max : number

	constructor(min : number, max : number)
	{
		this.min = min;
		this.max = max;
	}
}

/**
 *	@brief Represent a range slider.
 *	@member limits The range
 *	@member value A 0 to 1 value representing a pourcentage of the range.
*/
export class RangeSlider
{
	public readonly limits : Range
	public readonly value : number

	constructor(limits : Range, value : number)
	{
		this.limits = limits;
		this.value = value;
	}
}

/**
 *	@brief Engine configuration class.
 *	@member court Define the court's properties and behabiours.
 *	@member player1 Define the player1's properties and behabiours.
 *	@member player2 Define the player2's properties and behabiours.
 *	@member ball Define the ball's properties and behabiours.
 *	@member net Define the net's properties and behabiours.
 *
 *	Furthermore, implements all the setters used by the settings.
 *	(defines function which enable users to customize settings properties)
 */
export class GameConfig implements IConfig
{
	private wrappedCourt : ACourt
	private wrappedPlayer1 : Player
	private wrappedPlayer2 : Player
	private wrappedBall : ABall
	private wrappedNet : Net

	constructor(court : ACourt, player1 : Player, player2 : Player,
		ball : ABall, net : Net)
	{
		this.wrappedCourt = court;
		this.wrappedPlayer1 = player1;
		this.wrappedPlayer2 = player2;
		this.wrappedBall = ball;
		this.wrappedNet = net;
	}

	get court() : ACourt { return (this.wrappedCourt); }
	get player1() : Player { return (this.wrappedPlayer1); }
	get player2() : Player { return (this.wrappedPlayer2); }
	get ball() : ABall { return (this.wrappedBall); }
	get net() : Net { return (this.wrappedNet); }

	//////////////////////////////////
	// Setters for set the settings //
	//////////////////////////////////

	/**
	 *	@brief Update target's value
	 *	@param min The minimal value possible
	 *	@param max The maximal value possible
	 *	@param value Between 0 and 1. Represent the result of a range slider.
	 *	@return 
	*/
	private static RangeSliderValue(rangeSlider : RangeSlider) : number
	{
		const distance : number = rangeSlider.limits.max - rangeSlider.limits.min;

		return distance * rangeSlider.value;
	}

	/// Converts a number to it hexadecimal value in a string
	private static NumbertoHexStr(numeric : number) : string
	{
		return "#"+ ('000000' + ((numeric)>>>0).toString(16)).slice(-6);
	}

	/// Same as ISet but for colors
	private static ISetColor(rangeSlider : RangeSlider, style : AStyle) : void
	{
		style.data = GameConfig.NumbertoHexStr(GameConfig.RangeSliderValue(rangeSlider));
	}

	/// Same as ISet but for texture
	private static ISetTexture(rangeSlider : RangeSlider, style : AStyle) : void
	{
		// TO DO
		console.log("Textures are not avalaible yet.");
	}

	/*
	*	The following properties are customizables
	*	by the final user:
	*	- court color
	*	- court texture
	*	- full screen on
	*	- full screen off
	*	- player1 paddle width
	*	- player2 paddle width
	*	- player1 paddle height
	*	- player2 paddle height
	*	- player1 paddle color
	*	- player2 paddle color
	*	- player1 paddle texture
	*	- player2 paddle texture
	*	- ball color
	*	- ball texture
	*	- ball speed
	*	- net width
	*	- net hight
	*	- net color
	*	- net texture
	*/

	set courtColor(rangeSlider : RangeSlider)
	{
		GameConfig.ISetColor(rangeSlider, this.court.style);
	}

	set courtTexture(rangeSlider : RangeSlider)
	{
		GameConfig.ISetTexture(rangeSlider, this.court.style);
	}

	public toFullScreen() : void
	{

	}

	public toDefaultScreen() : void
	{

	}

	set player1Width(rangeSlider : RangeSlider)
	{
		this.player1.width = GameConfig.RangeSliderValue(rangeSlider);
	}

	set player1Height(rangeSlider : RangeSlider)
	{
		this.player1.height = GameConfig.RangeSliderValue(rangeSlider);
	}

	set player2Width(rangeSlider : RangeSlider)
	{
		this.player2.width = GameConfig.RangeSliderValue(rangeSlider);
	}

	set player2Height(rangeSlider : RangeSlider)
	{
		this.player2.height = GameConfig.RangeSliderValue(rangeSlider);
	}

	set player1Color(rangeSlider : RangeSlider)
	{
		GameConfig.ISetColor(rangeSlider, this.player1.style);
	}

	set player2Color(rangeSlider : RangeSlider)
	{
		GameConfig.ISetColor(rangeSlider, this.player2.style);
	}

	set player1Texture(rangeSlider : RangeSlider)
	{
		GameConfig.ISetTexture(rangeSlider, this.player1.style);
	}

	set player2Texture(rangeSlider : RangeSlider)
	{
		GameConfig.ISetTexture(rangeSlider, this.player2.style);
	}

	set ballColor(rangeSlider : RangeSlider)
	{
		GameConfig.ISetColor(rangeSlider, this.ball.style);
	}

	set ballTexture(rangeSlider : RangeSlider)
	{
		GameConfig.ISetTexture(rangeSlider, this.ball.style);
	}

	set ballSpeed(rangeSlider : RangeSlider)
	{
		this.ball.speed = GameConfig.RangeSliderValue(rangeSlider);
	}

	set netHeight(rangeSlider : RangeSlider)
	{
		this.net.height = GameConfig.RangeSliderValue(rangeSlider);
	}

	set netColor(rangeSlider : RangeSlider)
	{
		GameConfig.ISetColor(rangeSlider, this.net.style);
	}

	set netTexture(rangeSlider : RangeSlider)
	{
		GameConfig.ISetTexture(rangeSlider, this.net.style);
	}
}
