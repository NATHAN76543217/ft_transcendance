
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

import { Ball, Game_Config, Court, Player, Direction } from "./shared"


/**
 *	@brief Represents a range between 2 values in a 2
 *	dimensional axis.
 *	@member min Represent the lower limit.
 *	@member max Represent the greather limit.
*/
export class Range
{
	min : number
	max : number

	constructor(min : number, max : number)
	{
		this.min = min;
		this.max = max;
	}
}

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

	pl1_paddle_width_range : Range
	pl1_paddle_height_range : Range
	pl2_paddle_width_range : Range
	pl2_paddle_height_range : Range
	ball_speed : Range
	net_width : Range
	net_height : Range

	constructor(pl1_paddle_width_range : Range,
		pl1_paddle_height_range : Range,
		pl2_paddle_width_range : Range,
		pl2_paddle_height_range : Range,
		ball_speed : Range,
		net_width : Range,
		net_height : Range)
	{
		this.pl1_paddle_width_range = pl1_paddle_width_range;
		this.pl1_paddle_height_range = pl1_paddle_height_range;
		this.pl2_paddle_width_range = pl2_paddle_width_range;
		this.pl2_paddle_height_range = pl2_paddle_height_range;
		this.ball_speed = ball_speed;
		this.net_width = net_width;
		this.net_height = net_height;
	}
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
 *	and infinity of Pongs specialisations with a single engine !)
 *	@method player1_handler
 *	@member player1_handler_type
 *	@method player2_handler
 *	@member player2_handler_type
 *	@member mode
 *	@member bot_level
 *	@method is_ball_on_left_court_side
 *	@method calc_paddle_rebound_angle_rads
 *	@method ball_speed_increment
 *	@method change_ball_direction
*/
export class Engine_Config
{
	player1_handler : (event : any, game_config : Game_Config) => void
	player1_handler_type : string
	player2_handler : (event : any, game_config : Game_Config) => void
	player2_handler_type : string
	mode : GameMode
	bot_level : number
	is_ball_on_left_court_side : (game_config : Game_Config) => Boolean
	calc_paddle_rebound_angle_rads : (ball : Ball, player : Player) => number
	ball_speed_increment : number
	change_ball_direction : (game_config : Game_Config, angle : number) => number

	constructor(player1_handler : (event : any, game_config : Game_Config) => void,
	player1_handler_type : string,
	player2_handler : (event : any, game_config : Game_Config) => void,
	player2_handler_type : string,
	mode : GameMode,
	bot_level : number,
	is_ball_on_left_court_side : (game_config : Game_Config) => Boolean,
	calc_paddle_rebound_angle_rads : (ball : Ball, player : Player) => number,
	ball_speed_increment : number,
	change_ball_direction : (game_config : Game_Config, angle : number) => number)
	{
		this.player1_handler = player1_handler;
		this.player1_handler_type = player1_handler_type;
		this.player2_handler = player2_handler;
		this.player2_handler_type;
		this.mode = mode;
		this.bot_level = bot_level;
		this.is_ball_on_left_court_side = is_ball_on_left_court_side;
		this.calc_paddle_rebound_angle_rads;
		this.ball_speed_increment = ball_speed_increment;
		this.change_ball_direction = change_ball_direction;
	}
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
	game_config : Game_Config
	settings_config : Settings_Config
	engine_config : Engine_Config

	constructor(config : Game_Config, settings_config : Settings_Config,
		engine_config : Engine_Config)
	{
		this.game_config = config;
		this.settings_config = settings_config;
		this.engine_config = engine_config;
	}

	// TO DO: Some data defined here will come in the config too.
	// Need to do the game setting.
	run() : void
	{
		/**
		 *	@brief Does all the calculations over the game
		 *	objects. Calculate the position of the ball,
		 *	the position of the paddles and the scores
		 *	values for each call.
		 *	NOTE: Each step is compartmentalized in a
		 *	self executing function.
		*/
		const update = () : void =>
		{
			(function on_front_collision(court : Court)
			{
				court.frontal_collision();
			})(this.game_config.court);
			
			(function update_ball_pos(ball : Ball) : void
			{
				ball.pos.x += ball.velocity.x;
				ball.pos.y += ball.velocity.y;
			})(this.game_config.ball);

			(function update_player2_pos(game_config : Game_Config,
				engine_config : Engine_Config) : void
			{
				// TO DO: For the moment event is no need
				// in the future the client will send the
				// data to the server ...
				// This definitions will change
				engine_config.player2_handler(
					engine_config.mode == GameMode.Single
					? 0 : 0, game_config);
			})(this.game_config, this.engine_config);

			(function on_border_collision(court : Court, ball : Ball) : void
			{
				if (court.lateral_collsion())
					ball.lateral_rebound();
			})(this.game_config.court, this.game_config.ball);

			(function on_paddle_collision(game_config : Game_Config,
				engine_config : Engine_Config) : void
			{
				const player : Player = engine_config.is_ball_on_left_court_side(
					game_config) ? game_config.player1 : game_config.player2;

				if (player.collision(game_config.ball))
				{
					(function update_ball_velocity(ball : Ball,
						engine_config : Engine_Config) : void
					{
						const rad_angle : number = engine_config.calc_paddle_rebound_angle_rads(
							ball, player);

						engine_config.change_ball_direction(game_config, rad_angle);

						ball.speed += engine_config.ball_speed_increment;
					})(game_config.ball, engine_config);
				}
			})(this.game_config, this.engine_config);
	  

		};

		/**
		 *	@brief Uses the canvas context graphic
		 *	lib to display the elements in the canvas.
		 *	NOTE: Each step is compartmentalized in a
		 *	self executing function.
		*/
		const render = () : void =>
		{

			const ctx : any = this.game_config.court.ctx;

			(function clear_court(court : Court) : void
			{
				court.clear();
			})(this.game_config.court);

			(function display_scores(game_config : Game_Config) : void
			{
				game_config.player1.score.draw(ctx);
				game_config.player2.score.draw(ctx);
			})(this.game_config);

			(function display_net(game_config : Game_Config) : void
			{
				game_config.net.draw_net(ctx, 
					game_config.net.direction == Direction.Vertical
					? game_config.court.height : game_config.court.width);
			})(this.game_config);

			(function display_players(game_config : Game_Config) : void
			{
				game_config.player1.draw(ctx);
				game_config.player2.draw(ctx);
			})(this.game_config);
			
			(function display_ball(ball : Ball) : void
			{  
				ball.draw(ctx);
			})(this.game_config.ball);
		};

		/**
		 *	@brief Call fps times update and render in a second.
		*/
		(function run_frames() : void
		{
			const fps : number = 50;

			setInterval(() : void => { update(); render(); }, 1000 / fps);
		})();
	}
}

