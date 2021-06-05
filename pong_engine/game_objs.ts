/**
 *	@file "pong_engine/game_objs.ts"
 *
 *	@brief Defines the objects composing the pong game.
*/

import { IPoint, Point, Circle, Rectangle } from "./shapes"
import { AStyle, Direction } from "./customization"
import { RangeSlider, IRangeSlider } from "./frontend_objs"

/**
 *	@brief Present a paddle (a mouving rectangle).
 *	@member limit_left A Point type representing the max letf slide point.
 *	@member limit_right A Point type representing the max right slide point.
 */
class Paddle extends Rectangle
{
	constructor(pos : IPoint, width : number, height : number, style : AStyle,
		public readonly limitLeft : IPoint, public readonly limitRight : Point)
	{
		super(pos, width, height, style);
		this.limitLeft = limitLeft;
		this.limitRight = limitLeft;
	}
}

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

	constructor(x : number, y : number, private color: string,
		private font : string)
	{
		super(x, y);
		this.score = 0;
		this.color = color;
		this.font = font;
	}

	public increaseScore()
	{ this.score++; }

	private static wrappedDraw(ctx : any, score : Score) : void
	{
		ctx.fillStyle = score.color;
		ctx.font = score.font;
		ctx.fillText(score.score, score.x, score.y);
	}

	public draw(ctx : any) : void
	{ Score.wrappedDraw(ctx, this); }
}

interface IPlayer
{
	pos : IPoint;
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
	constructor(pos : IPoint, width : number, height : number, style : AStyle,
	limitLeft : IPoint, limitRight : IPoint, public readonly score : Score)
	{
		super(pos, width, height, style, limitLeft, limitRight);
		this.score = score;
	}

	public scorePoint() : void
	{ this.score.increaseScore(); }
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
	constructor(pos : IPoint, rad : number, style : AStyle,
		public velocity : IPoint, public speed : number,
		private defaultBall : ABall)
	{
		super(pos, rad, style);
		this.velocity = velocity;
		this.speed = speed;
		this.defaultBall = defaultBall;
	}

	public abstract frontalRebound() : void;
	public abstract lateralRebound() : void;

	public reset() : void
	{
		this.pos = this.defaultBall.pos;
		this.velocity = this.defaultBall.velocity;
		this.speed = this.defaultBall.speed;
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

	constructor(canvasName : string, public style : AStyle)
	{
		this.canvas = document.getElementById(canvasName);
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
		this.style = style;
	}

	public abstract onFrontalCollision(player1 : Player, player2 : Player, ball : Circle) : void;
	public abstract onLateralCollision(ball : Circle) : boolean;

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

/**
 *	@brief Represents the net. Can be displayed horizontally or vertically.
 *	NOTE: Contains Rectangle members.
 *	@member direction A string that can be "vertical" or "horizonal" which
 *	represent the direction of the net.
 *	@method drawNet Draws the net following the given dirrection.
*/
export class Net extends Rectangle
{
	constructor(pos : IPoint, width : number, height : number, style : AStyle,
		public readonly direction : Direction)
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
	{ Net.wrappedDrawNet(ctx, courtWidth, this); }
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

	set courtColor(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetColor(rangeSlider, this.court.style); }

	set courtTexture(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetTexture(rangeSlider, this.court.style); }

	public toFullScreen() : void
	{ }

	public toDefaultScreen() : void
	{ }

	set player1Width(rangeSlider : IRangeSlider)
	{ this.player1.width = RangeSlider.RangeSliderValue(rangeSlider); }

	set player1Height(rangeSlider : IRangeSlider)
	{ this.player1.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set player2Width(rangeSlider : IRangeSlider)
	{ this.player2.width = RangeSlider.RangeSliderValue(rangeSlider); }

	set player2Height(rangeSlider : IRangeSlider)
	{ this.player2.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set player1Color(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetColor(rangeSlider, this.player1.style); }

	set player2Color(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetColor(rangeSlider, this.player2.style); }

	set player1Texture(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetTexture(rangeSlider, this.player1.style); }

	set player2Texture(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetTexture(rangeSlider, this.player2.style); }

	set ballColor(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetColor(rangeSlider, this.ball.style); }

	set ballTexture(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetTexture(rangeSlider, this.ball.style); }

	set ballSpeed(rangeSlider : IRangeSlider)
	{ this.ball.speed = RangeSlider.RangeSliderValue(rangeSlider); }

	set netHeight(rangeSlider : IRangeSlider)
	{ this.net.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set netColor(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetColor(rangeSlider, this.net.style); }

	set netTexture(rangeSlider : IRangeSlider)
	{ RangeSlider.ISetTexture(rangeSlider, this.net.style); }
}
