
/**
 *  @file "pong_engine/engine.ts"
 *  @brief Contains the underlying engine which makes
 *  any Pong kind (variation) happen.
 *	The engine works using 3 configuration classes:
 *	- Game_Config: defines how the game will be.
 *	- Settings_Config: defines the limits of the settings sliders.
 *	- Engine_Config: defines how the engine will work.
 *
 * 	NOTE: Both, "Settings_Congig" and "Engine_Config" are defined
 * 	in this file. However "Game_Settings" is defined in "shared.ts"
*/

import { Ball, Game_Config, Player, Direction, Range } from "./shared"

/**
 *	@brief Class that store the range of the settings sliders.
 *	@member pl1_paddle_width_range Player1's paddle width limits.
 *	@member pl1_paddle_height_range Player1's paddle height limits.
 *	@member pl2_paddle_width_range Player2's paddle width limits.
 *	@member pl2_paddle_height_range Player2's paddle height limits.
 *	@member ball_speed Ball speed limits.
 *	@member net_width Net width limits.
 *	@member net_height Net height limits.
*/
export class Settings_Config
{
	// TO DO: Add Style

	private p_pl1_paddle_width_range : Range
	private p_pl1_paddle_height_range : Range
	private p_pl2_paddle_width_range : Range
	private p_pl2_paddle_height_range : Range
	private p_ball_speed : Range
	private p_net_width : Range
	private p_net_height : Range

	constructor(pl1_paddle_width_range : Range,
		pl1_paddle_height_range : Range,
		pl2_paddle_width_range : Range,
		pl2_paddle_height_range : Range,
		ball_speed : Range,
		net_width : Range,
		net_height : Range)
	{
		this.p_pl1_paddle_width_range = pl1_paddle_width_range;
		this.p_pl1_paddle_height_range = pl1_paddle_height_range;
		this.p_pl2_paddle_width_range = pl2_paddle_width_range;
		this.p_pl2_paddle_height_range = pl2_paddle_height_range;
		this.p_ball_speed = ball_speed;
		this.p_net_width = net_width;
		this.p_net_height = net_height;
	}

	public get pl1_paddle_width_range() : Range { return (this.p_pl1_paddle_width_range); }
	public get pl1_paddle_height_range() : Range { return (this.p_pl1_paddle_height_range); }
	public get pl2_paddle_width_range() : Range { return (this.p_pl2_paddle_width_range); }
	public get pl2_paddle_height_range() : Range { return (this.p_pl2_paddle_height_range); }
	public get ball_speed() : Range { return (this.p_ball_speed); }
	public get net_width() : Range { return (this.p_net_width); }
	public get net_height() : Range { return (this.p_net_height); }
}

// To change file
function PongBot(bot : Player, ball : Ball, level : number)
{
	bot.pos.y += ((ball.pos.y - (bot.pos.y + bot.height / 2))) * level;
}

// To change file
function is_ball_on_left_court_side_horizontal(game_config : Game_Config) : Boolean
{
	return (game_config.ball.pos.x + game_config.ball.rad
		< game_config.court.width / 2);
}

// To change file
function calc_paddle_rebound_angle_rads_horizontal(ball : Ball, player : Player) : number
{
	/// Get a in radian the normalized angle
	/// Default angles:
	/// -45 (-PI / 4) (ball hit on the top)
	/// 0 (ball hit on the middle)
	/// 45 (PI / 4) (ball hit on the bottom)
	return (((ball.pos.y - (player.pos.y + player.height / 2)) // Get value
	/ player.height / 2) * (Math.PI / 4)); // Normalize it and convert to rads
}

// To change file
function change_ball_direction_horizontal(game_config : Game_Config, angle : number)
{
	const direction : number = (game_config.ball.pos.x + game_config.ball.rad
		< game_config.court.width / 2) ? 1 : -1;

	game_config.ball.velocity.x = direction * game_config.ball.speed * Math.cos(angle);
	game_config.ball.velocity.y = game_config.ball.speed * Math.sin(angle);
}

enum GameMode
{
	Single,
	Multiplayer
}

/**
 *	@brief Define engine's constants and methods, which specilises
 *	the calculations performed by the engine (enabling to create
 *	and infinity of Pongs specialisations with a single engine !).
 *	@method player1_handler Updates player1's paddle position.
 *	@member player1_handler_type Defines the type of the handler.
 *	@method player2_handler Updates payer2's paddle position.
 *	@member player2_handler_type Defines the type of the handler.
 *	@member mode Can be Multiplayer or Single.
 *	@member bot_level Define the difficulty in Single mode
 *	@method is_ball_on_player1_side Return true of the ball is in
 *	player1's side.
 *	@method calc_paddle_rebound_angle_rads Calc the rebound angle
 *	 of the ball in an arbitrary player the paddle.
 *	@method ball_speed_increment The amount the ball increment its
 *	sleep each time a collison with a paddle is performed. 
 *	@method change_ball_direction A function that inverses the
 *	paddle to paddle ball direction.
*/
export class Engine_Config
{
	private p_player1_handler : (event : any, game_config : Game_Config) => void
	private p_player1_handler_type : string
	private p_player2_handler : (event : any, game_config : Game_Config) => void
	private p_player2_handler_type : string
	private p_mode : GameMode
	private p_bot_level : number
	private p_is_ball_on_player1_side : (game_config : Game_Config) => Boolean
	private p_calc_paddle_rebound_angle_rads : (ball : Ball, player : Player) => number
	private p_ball_speed_increment : number
	private p_change_ball_direction : (game_config : Game_Config, angle : number) => number

	constructor(player1_handler : (event : any, game_config : Game_Config) => void,
	player1_handler_type : string,
	player2_handler : (event : any, game_config : Game_Config) => void,
	player2_handler_type : string,
	mode : GameMode,
	bot_level : number,
	is_ball_on_player1_side : (game_config : Game_Config) => Boolean,
	calc_paddle_rebound_angle_rads : (ball : Ball, player : Player) => number,
	ball_speed_increment : number,
	change_ball_direction : (game_config : Game_Config, angle : number) => number)
	{
		this.p_player1_handler = player1_handler;
		this.p_player1_handler_type = player1_handler_type;
		this.p_player2_handler = player2_handler;
		this.p_player2_handler_type = player2_handler_type;
		this.p_mode = mode;
		this.p_bot_level = bot_level;
		this.p_is_ball_on_player1_side = is_ball_on_player1_side;
		this.p_calc_paddle_rebound_angle_rads = calc_paddle_rebound_angle_rads;
		this.p_ball_speed_increment = ball_speed_increment;
		this.p_change_ball_direction = change_ball_direction;
	}

	public get player1_handler() : (event : any, game_config : Game_Config) => void { return (this.p_player1_handler); }
	public get player1_handler_type() : string { return (this.p_player1_handler_type); }
	public get player2_handler() : (event : any, game_config : Game_Config) => void { return (this.p_player2_handler); }
	public get player2_handler_type() : string { return (this.p_player2_handler_type); }
	public get mode() : GameMode { return (this.p_mode); }
	public get bot_level() : number { return (this.p_bot_level); }
	public get is_ball_on_player1_side() : (game_config : Game_Config) => Boolean { return (this.p_is_ball_on_player1_side); }
	public get calc_paddle_rebound_angle_rads() : (ball : Ball, player : Player) => number {return (this.p_calc_paddle_rebound_angle_rads); }
	public get ball_speed_increment() : number { return (this.p_ball_speed_increment); }
	public get change_ball_direction() : (game_config : Game_Config, angle : number) => number { return (this.p_change_ball_direction); }
}

/**
 *	@brief The engine. Generate and run a complete pong
 *	using a Config Object from "shared.ts".
 *	@member game_config The configuration file used as consensus by the engine.
 *	@member settings_config The values used to set up the pong settings.
 *	@member engine_config The methods that the engine will use.
 *	@method run Generates a pong using the given config.
*/
export class Engine
{
	private game_config : Game_Config
	private settings_config : Settings_Config
	private engine_config : Engine_Config

	constructor(config : Game_Config, settings_config : Settings_Config,
		engine_config : Engine_Config)
	{
		this.game_config = config;
		this.settings_config = settings_config;
		this.engine_config = engine_config;
	}

	//////////////////
	// CALCULATIONS //
	//////////////////

	private handle_front_collision() : void
	{
		this.game_config.court.frontal_collision();
	}

	private handle_border_collision()
	{
		if (this.game_config.court.lateral_collsion())
			this.game_config.ball.lateral_rebound();
	}

	private update_ball_position() : void
	{
		this.game_config.ball.pos.x += this.game_config.ball.velocity.x;
		this.game_config.ball.pos.y += this.game_config.ball.velocity.y;
	}

	private update_player2_position() : void
	{
		// TO DO: For the moment event is no need
		// in the future the client will send the
		// data to the server ...
		// This definitions will change
		this.engine_config.player2_handler(this.engine_config.mode == GameMode.Single
		? 0 : 0, this.game_config);
	}

	private update_ball_velocity(player : Player) : void
	{
		const rad_angle : number = this.engine_config.calc_paddle_rebound_angle_rads(
			this.game_config.ball, player);

		this.engine_config.change_ball_direction(this.game_config, rad_angle);

		this.game_config.ball.speed += this.engine_config.ball_speed_increment;
	}

	private haddle_paddle_collision() : void
	{
		const player : Player = this.engine_config.is_ball_on_player1_side(
			this.game_config) ? this.game_config.player1 : this.game_config.player2;

		if (player.collision(this.game_config.ball))
			this.update_ball_velocity(player);
	}

	/**
	 *	@brief Does all the calculations over the game
	 *	objects. Calculate the position of the ball,
	 *	the position of the paddles and the scores
	 *	values for each call.
	*/
	private update() : void
	{
		this.handle_front_collision();
		this.update_ball_position();
		this.update_player2_position();
		this.handle_border_collision();
		this.haddle_paddle_collision();
	}

	///////////////////
	// RENDERIZATION //
	///////////////////

	private clear_court() : void
	{
		this.game_config.court.clear();
	}

	private display_scores(ctx : any) : void
	{
		this.game_config.player1.score.draw(ctx);
		this.game_config.player2.score.draw(ctx);
	}

	private display_net(ctx : any) : void
	{
		this.game_config.net.draw_net(ctx, this.game_config.net.direction 
			== Direction.Vertical ? this.game_config.court.height
			: this.game_config.court.width);
	}

	private display_players(ctx : any) : void
	{
		this.game_config.player1.draw(ctx);
		this.game_config.player2.draw(ctx);
	}

	private display_ball(ctx : any) : void
	{
		this.game_config.ball.draw(ctx);
	}

	/**
	 *	@brief Uses the canvas context graphic
	 *	lib to display the elements in the canvas.
	*/
	private render()
	{
		this.clear_court();
		this.display_scores(this.game_config.court.ctx);
		this.display_net(this.game_config.court.ctx);
		this.display_players(this.game_config.court.ctx);
		this.display_ball(this.game_config.court.ctx);
	}

	public run() : void
	{
		const fps : number = 50;

		setInterval(() : void => { this.update(); this.render(); }, 1000 / fps);
	}
}

