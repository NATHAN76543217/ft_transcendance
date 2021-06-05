
/**
 *  @file "pong_engine/engine.ts"
 *  @brief Contains the underlying engine which makes
 *  any Pong kind (variation) happen.
 *	The engine works using 3 configuration classes:
 *	- GameConfig: defines how the game will be.
 *	- SettingsConfig: defines the limits of the settings sliders.
 *	- EngineConfig: defines how the engine will work.
 *
*/

import { ABall, GameConfig, Player } from "./game_objs"
import { Range } from "./frontend_objs"
import { Direction } from "./customization"

/**
 *	@brief Class that store the range of the settings sliders.
 *	@member pl1Width Player1's paddle width limits.
 *	@member pl1Height Player1's paddle height limits.
 *	@member pl2Width Player2's paddle width limits.
 *	@member pl2Height Player2's paddle height limits.
 *	@member ballSpeed Ball speed limits.
 *	@member netSpeed Net width limits.
 *	@member netHeight Net height limits.
*/
export abstract class ASettingsConfig
{
	// TO DO: Add Style
	public abstract readonly pl1Width : Range
	public abstract readonly pl1Height : Range
	public abstract readonly pl2Width : Range
	public abstract readonly pl2Height : Range
	public abstract readonly ballSpeed : Range
	public abstract readonly netSpeed : Range
	public abstract readonly netHeight : Range
}

// To change file
function pongBot(bot : Player, ball : ABall, level : number)
{
	bot.pos.y += ((ball.pos.y - (bot.pos.y + bot.height / 2))) * level;
}

// To change file
function is_ball_on_left_court_side_horizontal(gameConfig : GameConfig) : Boolean
{
	return (gameConfig.ball.pos.x + gameConfig.ball.rad
		< gameConfig.court.width / 2);
}

// To change file
function calc_paddle_rebound_angle_rads_horizontal(ball : ABall, player : Player) : number
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
function change_ball_direction_horizontal(gameConfig : GameConfig, angle : number)
{
	const direction : number = (gameConfig.ball.pos.x + gameConfig.ball.rad
		< gameConfig.court.width / 2) ? 1 : -1;

	gameConfig.ball.velocity.x = direction * gameConfig.ball.speed * Math.cos(angle);
	gameConfig.ball.velocity.y = gameConfig.ball.speed * Math.sin(angle);
}

enum GameMode
{
	SINGLEPLAYER,
	MULTIPLAYER
}

/**
 *	@brief Define engine's constants and methods, which specilises
 *	the calculations performed by the engine (enabling to create
 *	and infinity of Pongs specialisations with a single engine !).
 *	@method updatePlayer1Pos Updates player1's paddle position.
 *	@member handlerPlayer1Type Defines the type of the handler.
 *	@method updatePlayer2Pos Updates payer2's paddle position.
 *	@member handlerPlayer2Type Defines the type of the handler.
 *	@member mode Can be Multiplayer or Single.
 *	@member botLevel Define the difficulty in Single mode
 *	@method isBallOnPlayer1Side Return true of the ball is in
 *	player1's side.
 *	@method getPaddleReboundRad Calc the rebound angle
 *	 of the ball in an arbitrary player the paddle.
 *	@member ballSpeedIncrement The amount the ball increment its
 *	sleep each time a collison with a paddle is performed. 
 *	@method changeBallDirection A function that inverses the
 *	paddle to paddle ball direction.
*/
export abstract class AEngineConfig
{
	public handlerPlayer1Type ?: string;
	public handlerPlayer2Type ?: string;

	public abstract updatePlayer1Pos(event : unknown , gameConfig : GameConfig) : void;
	public abstract updatePlayer2Pos(event : unknown , gameConfig : GameConfig) : void;
	public abstract isBallOnPlayer1Side(gameConfig : GameConfig) : boolean;
	public abstract getPaddleReboundRad(ball : ABall, player : Player) : number;
	public abstract changeBallDirection(gameConfig : GameConfig, angle : number) : number;

	constructor(public readonly mode : GameMode, public botLevel : number,
		public readonly ballSpeedIncrement : number)
	{
		this.mode = mode;
		this.botLevel = botLevel;
		this.ballSpeedIncrement = ballSpeedIncrement;
	}
}

/**
 *	@brief The engine. Generate and run a complete pong
 *	using a Config Object from "shared.ts".
 *	@member gameConfig The configuration file used as consensus by the engine.
 *	@member setingsConfig The values used to set up the pong settings.
 *	@member engineConfig The methods that the engine will use.
 *	@method run Generates a pong using the given config.
*/
export class Engine
{
	constructor(private gameConfig : GameConfig,
		private settingsConfig : ASettingsConfig,
		private engineConfig : AEngineConfig)
	{
		this.gameConfig = gameConfig;
		this.settingsConfig = settingsConfig;
		this.engineConfig = engineConfig;
	}

	//////////////////
	// CALCULATIONS //
	//////////////////

	private static onFrontCollision(gameConfig : GameConfig) : void
	{
		gameConfig.court.onFrontalCollision(gameConfig.player1,
			gameConfig.player2, gameConfig.ball);
	}

	private static onBorderCollision(gameConfig : GameConfig) : void
	{
		if (gameConfig.court.onLateralCollision(gameConfig.ball))
			gameConfig.ball.lateralRebound();
	}

	private static updateBallPos(gameConfig : GameConfig) : void
	{
		gameConfig.ball.pos.x += gameConfig.ball.velocity.x;
		gameConfig.ball.pos.y += gameConfig.ball.velocity.y;
	}

	private static updatePlayersPos(gameConfig : GameConfig,
		engineConfig : AEngineConfig) : void
	{
		// TO DO: For the moment event is no need
		// in the future the client will send the
		// data to the server ...
		// This definitions will change
		engineConfig.updatePlayer1Pos(engineConfig.mode
			== GameMode.SINGLEPLAYER ? 0 : 0, gameConfig); // bool need ?
		engineConfig.updatePlayer2Pos(engineConfig.mode
			== GameMode.SINGLEPLAYER ? 0 : 0, gameConfig);
	}

	private static updateBallVelocity(player : Player, gameConfig : GameConfig,
		engineConfig : AEngineConfig) : void
	{
		engineConfig.changeBallDirection(gameConfig,
			engineConfig.getPaddleReboundRad(gameConfig.ball, player));
		gameConfig.ball.speed += engineConfig.ballSpeedIncrement;
	}

	private static onPaddleCollision(gameConfig : GameConfig,
		engineConfig : AEngineConfig) : void
	{
		const player : Player = engineConfig.isBallOnPlayer1Side(
			gameConfig) ? gameConfig.player1 : gameConfig.player2;

		if (player.thereIsCollision(gameConfig.ball))
			Engine.updateBallVelocity(player, gameConfig, engineConfig);
	}

	/**
	 *	@brief Does all the calculations over the game
	 *	objects. Calculate the position of the ball,
	 *	the position of the paddles and the scores
	 *	values for each call.
	*/
	private static update(gameConfig : GameConfig, engineConfig : AEngineConfig) : void
	{
		Engine.onFrontCollision(gameConfig);
		Engine.updateBallPos(gameConfig);
		Engine.updatePlayersPos(gameConfig, engineConfig);
		Engine.onBorderCollision(gameConfig);
		Engine.onPaddleCollision(gameConfig, engineConfig);
	}

	///////////////////
	// RENDERIZATION //
	///////////////////

	private static clearCourt(gameConfig : GameConfig) : void
	{ gameConfig.court.clear(); }

	private static displayScores(gameConfig : GameConfig) : void
	{
		gameConfig.player1.score.draw(gameConfig.court.ctx);
		gameConfig.player2.score.draw(gameConfig.court.ctx);
	}

	private static displayNet(gameConfig : GameConfig) : void
	{
		gameConfig.net.drawNet(gameConfig.court.ctx, gameConfig.net.direction 
			== Direction.VERTICAL ? gameConfig.court.height
			: gameConfig.court.width);
	}

	private static displayPlayers(gameConfig : GameConfig) : void
	{
		gameConfig.player1.draw(gameConfig.court.ctx);
		gameConfig.player2.draw(gameConfig.court.ctx);
	}

	private static displayBall(gameConfig : GameConfig) : void
	{ gameConfig.ball.draw(gameConfig.court.ctx); }

	/**
	 *	@brief Uses the canvas context graphic
	 *	lib to display the elements in the canvas.
	*/
	private static render(gameConfig : GameConfig)
	{
		Engine.clearCourt(gameConfig);
		Engine.displayScores(gameConfig);
		Engine.displayNet(gameConfig);
		Engine.displayPlayers(gameConfig);
		Engine.displayBall(gameConfig);
	}

	public readonly run = () : void => {
		const fps : number = 50;

		setInterval(() : void => {
			Engine.update(this.gameConfig, this.engineConfig);
			Engine.render(this.gameConfig);
		}, 1000 / fps);
	}
}
