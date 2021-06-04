
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
export class Style
{
	private p_data : string
	private apply_f : (ctx : any, style : Style) => void

	constructor(data : string, apply_f : (ctx : any, style : Style) => void)
	{
		this.p_data = data;
		this.apply_f = apply_f;
	}

	public apply(ctx : any) : void
	{
		this.apply_f(ctx, this);
	}

	public get data() : string { return (this.p_data); }
	public set set_data(data : string) { this.p_data = data; }
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
	private p_rad : number
	private p_style : Style

	constructor(pos : Point, rad : number, style : Style)
	{
		this.pos = pos;
		this.p_rad = rad;
		this.p_style = style;
	}

	public get rad() : number { return (this.p_rad); }
	public get style() : Style { return (this.p_style); }

	/// Must use canvas's context.
	public draw(ctx : any) : void
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
	public pos : Point
	private p_width : number
	private p_height : number
	private p_style : Style

	constructor(pos : Point, width : number, height : number, style : Style)
	{
		this.pos = pos;
		this.p_width = width;
		this.p_height = height;
		this.p_style = style;
	}

	public get width() : number { return (this.p_width); }
	public get height() : number { return (this.p_height); }

	public set set_width(width : number) { this.p_width = width; }
	public set set_height(height : number) { this.p_height = height; }

	public get style() : Style { return (this.p_style); }

	// Perhabs i need to specilise this one too !
	public collision(ball : Circle) : boolean
	{
		return (this.pos.x < ball.pos.x + ball.rad // rectangle left < ball right
		&& this.pos.y < ball.pos.y + ball.rad // rectangle top < ball bottom
		&& this.pos.x + this.width > ball.pos.x - ball.rad // rectangle right > ball left
		&& this.pos.y + this.height > ball.pos.y - ball.rad); // rectangle bottom > ball top
	}

	public draw(ctx : any) : void
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
	private p_limit_left : Point
	private p_limit_right : Point
	private p_EventListenner_type : string
	private EventListenner_handler_f : (event : any, paddle : Paddle) => void

	constructor(pos : Point, width : number, height : number, style : Style,
	limit_left : Point, limit_right : Point, EventListenner_type : string,
	EventListenner_handler_f : (event : any, paddle : Paddle) => void)
	{
		super(pos, width, height, style);
		this.p_limit_left = limit_left;
		this.p_limit_right = limit_right;
		this.p_EventListenner_type = EventListenner_type;
		this.EventListenner_handler_f = EventListenner_handler_f;
	}

	public get limit_left() : Point { return (this.p_limit_left); }
	public get limit_right() : Point { return (this.p_limit_right); }
	public get EventListenner_type() : string { return (this.p_EventListenner_type); }

	public EventListenner_handler(event : any) : void
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

	public increase_score()
	{
		this.score++;
	}

	public draw(ctx : any) : void
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
	private p_score : Score

	constructor(pos : Point, width : number, height : number, style : Style,
	limit_left : Point, limit_right : Point, EventListenner_type : string,
	EventListenner_handler : (event : any) => void, score : Score)
	{
		super(pos, width, height, style, limit_left, limit_right,
			EventListenner_type, EventListenner_handler);
		this.p_score = score;
	}

	get score() : Score { return (this.p_score); }

	public score_point() : void
	{
		this.p_score.increase_score();
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
	public velocity : Point
	public speed : number
	private default : Ball
	private reverse_f : (ball : Ball) => void
	private rebound_f : (ball : Ball) => void

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

	public frontal_rebound() : void
	{
		this.reverse_f(this);
	}

	public lateral_rebound() : void
	{
		this.rebound_f(this);
	}

	public reset() : void
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
	private p_canvas : any
	private p_ctx : any
	private p_width : number
	private p_height : number
	private p_style : Style
	private frontal_collision_f : (court : Court) => void
	private lateral_collision_f : (court : Court) => boolean

	constructor(canvas_name : string, style : Style,
	frontal_collision_f : (court : Court) => void,
	lateral_collision_f : (court : Court) => boolean)
	{
		this.p_canvas = document.getElementById(canvas_name);
		this.p_ctx = this.p_canvas.getContext("2d");
		this.p_width = this.p_canvas.clientWidth;
		this.p_height = this.p_canvas.clientHeight;
		this.p_style = style;
		this.frontal_collision_f = frontal_collision_f;
		this.lateral_collision_f = lateral_collision_f;
	}

	public get canvas() : any { return (this.p_canvas); }
	public get ctx() : any { return (this.p_ctx); }
	public get width() : number { return (this.p_width); }
	public get height() : number { return (this.p_height); }
	public get style() : Style { return (this.p_style); }

	public frontal_collision() : void
	{
		// (player1 : Player, player2 : Player, ball : Circle) => void
		this.frontal_collision_f(this);
	}

	public lateral_collsion() : Boolean
	{
		// (ball : Circle) => boolean
		return this.lateral_collision_f(this);
	}

	public clear() : void
	{
		this.p_style.apply(this.p_ctx);
		this.p_ctx.fillRect(0, 0, this.p_width, this.p_height);
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
	private p_direction : Direction

	constructor(pos : Point, width : number, height : number, style : Style,
		direction : Direction)
	{
		super(pos, width, height, style);
		this.p_direction = direction;
		delete this.draw;
	}

	public get direction() : Direction { return (this.p_direction); }

	/**
	* @brief Generates a sequence start - end by steps distance.
	* @param start The start of the sequence.
	* @param step Distance between each generated value.
	* @param end The end of the sequence.
	* @yields Each step.
	*/
	private *generate_position(start : number, step : number, end : number) // TO DO: Check return type
	{
		for ( ; start < end / step ; start++)
				yield start * step;
	}

	public draw_net(ctx : any, court_width : number) : void
	{
		for (const i of this.generate_position(0, 15, court_width))
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
 *	@brief Represents a range between 2 values in a 2
 *	dimensional axis.
 *	@member min Represent the lower limit.
 *	@member max Represent the greather limit.
*/
export class Range
{
	public min : number
	public max : number

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
	private p_limits : Range
	private p_value : number

	constructor(limits : Range, value : number)
	{
		this.p_limits = limits;
		this.p_value = value;
	}

	public get limits() : Range { return (this.p_limits); }
	public get value() : number { return (this.p_value); }
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
	private p_court : Court
	private p_player1 : Player
	private p_player2 : Player
	private p_ball : Ball
	private p_net : Net

	constructor(court : Court, player1 : Player, player2 : Player,
		ball : Ball, net : Net)
	{
		this.p_court = court;
		this.p_player1 = player1;
		this.p_player2 = player2;
		this.p_ball = ball;
		this.p_net = net;
	}

	public get court() : Court { return (this.p_court); }
	public get player1() : Player { return (this.p_player1); }
	public get player2() : Player { return (this.p_player2); }
	public get ball() : Ball { return (this.p_ball); }
	public get net() : Net { return (this.p_net); }

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
	private static RangeSliderValue(range_slider : RangeSlider) : number
	{
		const distance : number = range_slider.limits.max - range_slider.limits.min;

		return distance * range_slider.value;
	}

	/// Converts a number to it hexadecimal value in a string
	private static NumberToRGBString(numeric : number) : string
	{
		return "#"+ ('000000' + ((numeric)>>>0).toString(16)).slice(-6);
	}

	/// Same as ISet but for colors
	private static ISetColor(range_slider : RangeSlider, style : Style) : void
	{
		style.set_data = Game_Config.NumberToRGBString(Game_Config.RangeSliderValue(range_slider));
	}

	/// Same as ISet but for texture
	private static ISetTexture(range_slider : RangeSlider, style : Style) : void
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

	public set set_court_color(range_slider : RangeSlider)
	{
		Game_Config.ISetColor(range_slider, this.court.style);
	}

	public set set_court_texture(range_slider : RangeSlider)
	{
		Game_Config.ISetTexture(range_slider, this.court.style);
	}

	public set_court_full_screen() : void
	{

	}

	public set_court_defualt_screen() : void
	{

	}

	public set set_player1_paddle_width(range_slider : RangeSlider)
	{
		this.player1.set_width = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_player1_paddle_height(range_slider : RangeSlider)
	{
		this.player1.set_height = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_player2_paddle_width(range_slider : RangeSlider)
	{
		this.player2.set_width = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_player2_paddle_height(range_slider : RangeSlider)
	{
		this.player2.set_height = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_player1_color(range_slider : RangeSlider)
	{
		Game_Config.ISetColor(range_slider, this.player1.style);
	}

	public set set_player2_color(range_slider : RangeSlider)
	{
		Game_Config.ISetColor(range_slider, this.player2.style);
	}

	public set set_player1_texture(range_slider : RangeSlider)
	{
		Game_Config.ISetTexture(range_slider, this.player1.style);
	}

	public set set_player2_texture(range_slider : RangeSlider)
	{
		Game_Config.ISetTexture(range_slider, this.player2.style);
	}

	public set set_ball_color(range_slider : RangeSlider)
	{
		Game_Config.ISetColor(range_slider, this.ball.style);
	}

	public set set_ball_texture(range_slider : RangeSlider)
	{
		Game_Config.ISetTexture(range_slider, this.ball.style);
	}

	public set set_ball_speed(range_slider : RangeSlider)
	{
		this.ball.speed = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_net_width(range_slider : RangeSlider)
	{
		this.net.set_height = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_net_height(range_slider : RangeSlider)
	{
		this.net.set_height = Game_Config.RangeSliderValue(range_slider);
	}

	public set set_net_color(range_slider : RangeSlider)
	{
		Game_Config.ISetColor(range_slider, this.net.style);
	}

	public set set_net_texture(range_slider : RangeSlider)
	{
		Game_Config.ISetTexture(range_slider, this.net.style);
	}
}
