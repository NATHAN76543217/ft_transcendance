
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
	x : number
	y : number

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
export class Style
{
	data : string
	apply_f : (ctx : any, style : Style) => void

	constructor(data : string, apply_f : (ctx : any, style : Style) => void)
	{
		this.data = data;
		this.apply_f = apply_f;
	}

	apply(ctx : any) : void
	{
		this.apply_f(ctx, this);
	}
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
	pos : Point
	rad : number
	style : Style

	constructor(pos : Point, rad : number, style : Style)
	{
		this.pos = pos;
		this.rad = rad;
		this.style = style;
	}

	/// Must use canvas's context.
	draw(ctx : any) : void
	{
		this.style.apply(ctx);
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
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
	pos : Point
	width : number
	height : number
	style : Style

	constructor(pos : Point, width : number, height : number, style : Style)
	{
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.style = style;
	}

	// Perhabs i need to specilise this one too !
	collision(ball : Circle) : boolean
	{
		return (this.pos.x < ball.pos.x + ball.rad // rectangle left < ball right
		&& this.pos.y < ball.pos.y + ball.rad // rectangle top < ball bottom
		&& this.pos.x + this.width > ball.pos.x - ball.rad // rectangle right > ball left
		&& this.pos.y + this.height > ball.pos.y - ball.rad); // rectangle bottom > ball top
	}

	draw(ctx : any) : void
	{
		this.style.apply(ctx);
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
}

/**
 *	@brief Present a paddle (a mouving rectangle).
 *	@member limit_left A Point type representing the max letf slide point.
 *	@member limit_right A Point type representing the max right slide point.
 *	@member EventListenner_type A string representing how the user control the paddle.
 *	@method EventListenner_handler The EventLister handler. 
 */
class Paddle extends Rectangle
{
	limit_left : Point
	limit_right : Point
	EventListenner_type : string
	EventListenner_handler_f : (event : any, paddle : Paddle) => void

	constructor(pos : Point, width : number, height : number, style : Style,
	limit_left : Point, limit_right : Point, EventListenner_type : string,
	EventListenner_handler_f : (event : any, paddle : Paddle) => void)
	{
		super(pos, width, height, style);
		this.limit_left = limit_left;
		this.limit_right = limit_right;
		this.EventListenner_type = EventListenner_type;
		this.EventListenner_handler_f = EventListenner_handler_f;
	}

	EventListenner_handler(event : any) : void
	{
		this.EventListenner_handler_f(event, this);
	}



	// TO DO: NOTE: Handler must use limits to move the paddle.
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
	score : number
	color: string
	font : string

	constructor(x : number, y : number, color : string, font : string)
	{
		super(x, y);
		this.score = 0;
		this.color = color;
		this.font = font;
	}

	draw(ctx : any) : void
	{
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.fillText(this.score, this.x, this.y);
	}
}

/**
 *	@brief Final class representing a player that constrols
 *	a paddle and has an score.
 *	@member score A Store type representing the score of the payer.
 *	@method score_point Fast typing: "this.score.score++;".
 */
export class Player extends Paddle
{
	score : Score

	constructor(pos : Point, width : number, height : number, style : Style,
	limit_left : Point, limit_right : Point, EventListenner_type : string,
	EventListenner_handler : (event : any) => void, score : Score)
	{
		super(pos, width, height, style, limit_left, limit_right,
			EventListenner_type, EventListenner_handler);
		this.score = score;
	}

	score_point() : void
	{
		this.score.score++;
	}
}

/**
 *	@brief Represent the final object of the ball.
 *	@member velocity How fast the ball moves into frames.
 *	@member speed Also used to define how fast the ball moves.
 *	@method reverse A function that reverses the ball's paddle
 *	to paddle dirrection.
 *	@method reset Put the ball on the middle of the court each
 *	time a player score.
 *	@method rebound A function that handle the ball direction when
 *	it collides in the court border.
*/
export class Ball extends Circle
{
	velocity : Point
	speed : number
	default : Ball
	reverse_f : (ball : Ball) => void
	rebound_f : (ball : Ball) => void

	constructor(pos : Point, rad : number, style : Style,
		velocity : Point, speed : number, dft : Ball,
		reverse_f : (ball : Ball) => void,
		rebound_f : (ball : Ball) => void)
	{
		super(pos, rad, style);
		this.velocity = velocity;
		this.speed = speed;
		this.default = dft;
		this.reverse_f = reverse_f;
		this,rebound_f = rebound_f;
	}

	frontal_rebound() : void
	{
		this.reverse_f(this);
	}

	lateral_rebound() : void
	{
		this.rebound_f(this);
	}

	reset() : void
	{
		this.pos = this.default.pos;
		this.velocity = this.default.velocity;
		this.speed = this.default.speed;
		this.frontal_rebound();
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
 *	@method frontal_collision A void function that increment the score of
 *	the player that scores a point.
 *	@method lateral_collision A function that return a bool which indicates if
*	the ball hit the border of the court.
*/
export class Court
{
	canvas : any
	ctx : any
	width : number
	height : number
	style : Style
	frontal_collision_f : (court : Court) => void
	lateral_collision_f : (court : Court) => boolean

	constructor(canvas_name : string, style : Style,
	frontal_collision_f : (court : Court) => void,
	lateral_collision_f : (court : Court) => boolean)
	{
		this.canvas = document.getElementById(canvas_name);
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
		this.style = style;
		this.frontal_collision_f = frontal_collision_f;
		this.lateral_collision_f = lateral_collision_f;
	}

	frontal_collision() : void
	{
		// (player1 : Player, player2 : Player, ball : Circle) => void
		this.frontal_collision_f(this);
	}

	lateral_collsion() : Boolean
	{
		// (ball : Circle) => boolean
		return this.lateral_collision_f(this);
	}

	clear() : void
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
	Vertical,
	Horizontal
}

/**
 *	@brief Represents the net. Can be displayed horizontally or vertically.
 *	NOTE: Contains Rectangle members.
 *	@member direction A string that can be "vertical" or "horizonal" which
 *	represent the direction of the net.
 *	@method draw_net Draws the net following the given dirrection.
*/
export class Net extends Rectangle
{
	direction : Direction

	constructor(pos : Point, width : number, height : number, style : Style,
		direction : Direction)
	{
		super(pos, width, height, style);
		this.direction = direction;
		delete this.draw;
	}

	draw_net(ctx : any, court_width : number) : void
	{
		/**
		* @brief Generates a sequence start - end by steps distance.
		* @param start The start of the sequence.
		* @param step Distance between each generated value.
		* @param end The end of the sequence.
		* @yields Each step.
		*/
		let gen_pos = function*(start : number, step : number, end : number) // TO DO: Check this for ts types
		{
			while (start < end / step)
				yield start++ * step;
		};

		for (const i of gen_pos(0, 15, court_width))
		{
			this.style.apply(ctx);
			const target_pos : Point = new Point(
				this.direction == Direction.Vertical ? this.pos.x : this.pos.x + i,
				this.direction == Direction.Vertical ? this.pos.y + i : this.pos.x);
			ctx.fillRect(target_pos.x, target_pos.y, this.width, this.height);
		}
	}
}

/////////////////////////////////
// ENGINE CONFIGURATION OBJECT //
/////////////////////////////////

export interface IConfig
{
	court : Court
	player1 : Player
	player2 : Player
	ball : Ball
	net : Net
}

/**
 *	@brief Update target's value
 *	@param min The minimal value possible
 *	@param max The maximal value possible
 *	@param value Between 0 and 1. Represent the result of a range slider.
 *	@param target The value to be set.
*/
function ISet(min : number, max : number, value : number, target : number) : void
{
	const distance : number = max - min;

	target = distance * value;
}

/// Converts a number to it hexadecimal value in a string
function NumberToRGBString(numeric : number) : string
{
	return "#"+ ('000000' + ((numeric)>>>0).toString(16)).slice(-6);
}

/// Same as ISet but for colors
function ISetColor(min : number, max : number, value : number, target : string) : void
{
	let color : number;

	ISet(min, max, value, color);
	target = NumberToRGBString(color);
}

/// Same as ISet but for texture
function ISetTexture(min : number, max : number, value : number, target : string) : void
{
	// TO DO
	console.log("Textures are not avalaible yet.");
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
export class Game_Config implements IConfig
{
	court : Court
	player1 : Player
	player2 : Player
	ball : Ball
	net : Net

	constructor(court : Court, player1 : Player, player2 : Player,
		ball : Ball, net : Net)
	{
		this.court = court;
		this.player1 = player1;
		this.player2 = player2;
		this.ball = ball;
		this.net = net;
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

	set_court_color(min : number, max : number, value : number) : void
	{
		ISetColor(min, max, value, this.court.style.data);
	}

	set_court_texture(min : number, max : number, value : number) : void
	{
		ISetTexture(min, max, value, this.court.style.data);
	}

	set_court_full_screen() : void
	{

	}

	set_court_defualt_screen() : void
	{

	}

	set_player1_paddle_width(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.player1.width);
	}

	set_player1_paddle_height(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.player1.height);
	}

	set_player2_paddle_width(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.player2.width);
	}

	set_player2_paddle_height(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.player2.height);
	}

	set_player1_color(min : number, max : number, value : number) : void
	{
		ISetColor(min, max, value, this.player1.style.data);
	}

	set_player2_color(min : number, max : number, value : number) : void
	{
		ISetColor(min, max, value, this.player2.style.data);
	}

	set_player1_texture(min : number, max : number, value : number) : void
	{
		ISetTexture(min, max, value, this.player1.style.data);
	}

	set_player2_texture(min : number, max : number, value : number) : void
	{
		ISetTexture(min, max, value, this.player2.style.data);
	}

	set_ball_color(min : number, max : number, value : number) : void
	{
		ISetColor(min, max, value, this.ball.style.data);
	}

	set_ball_texture(min : number, max : number, value : number) : void
	{
		ISetTexture(min, max, value, this.ball.style.data);
	}

	set_ball_speed(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.ball.speed);
	}

	set_net_width(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.net.height);
	}

	set_net_height(min : number, max : number, value : number) : void
	{
		ISet(min, max, value, this.net.height);
	}

	set_net_color(min : number, max : number, value : number) : void
	{
		ISetColor(min, max, value, this.net.style.data);
	}

	set_net_texture(min : number, max : number, value : number) : void
	{
		ISetTexture(min, max, value, this.net.style.data);
	}
}
