
/**
 *  @file "pong_engine/engine.ts"
 *  @brief Contains the underlying engine which makes
 *  any Pong kind (variation) happen.
 *	The engine works using 3 configuration classes:
 *	- GameConfig: defines how the game will be.
 *	- SettingsConfig: defines the limits of the settings sliders.
 *	- EngineConfig: defines how the engine will work.
*/

import {
	Range
} from "./frontend_objs"
import {
	Direction
} from "./customization"
import {
	ABall,
	GameConfig,
	Player
} from "./game_objs"
import {
	PongSocketServer
} from "./sockerServer"


import SettingsConfigOutOfRange from "./exceptions/SettingsConfigOutOfRange.exception"
import SettingsConfigDiffSizes from "./exceptions/SettingsConfigDiffSizes.exception"
import SettingsConfigInvalidBallSpeed from "./exceptions/SettingsConfigInvalidBallSpeed.exception"

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
export class ASettingsConfig
{
	constructor(
		// TO DO: Add Style
		public readonly pl1Width : Range,
		public readonly pl1Height : Range,
		public readonly pl2Width : Range,
		public readonly pl2Height : Range,
		public readonly ballSpeed : Range,
		//public readonly netWidth : Range,
		//public readonly netHeight : Range // why have a customizable net ?
	) { }

	public checkRanges(canvas : HTMLElement)
	{
		const WITDH_RATIO : number = 20;
		const HEIGHT_RATIO : number = 4;
		const MAX_BALL_SPEED : number = 40;

		if (this.pl1Width.min - this.pl1Width.max > canvas.clientWidth / WITDH_RATIO
		|| this.pl1Height.min - this.pl1Height.max > canvas.clientHeight / HEIGHT_RATIO
		|| this.pl2Width.min - this.pl1Width.max > canvas.clientWidth / WITDH_RATIO
		|| this.pl2Height.min - this.pl2Height.max > canvas.clientHeight / HEIGHT_RATIO)
			throw new SettingsConfigOutOfRange();

		if (this.pl1Width != this.pl2Width || this.pl1Height != this.pl2Height)
			throw new SettingsConfigDiffSizes();

		if (this.ballSpeed.min < 1 || this.ballSpeed.max > MAX_BALL_SPEED)
			throw new SettingsConfigInvalidBallSpeed();

		// TO DO: Exceptions, create class that hold the engine for this specific game (classic pong)
	}
}

export enum GameMode
{
	SINGLEPLAYER,
	MULTIPLAYER
}

export type PosUpdaterLevel = number;
export type PosUpdaterEvent = unknown;

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
	public handlerPlayer1Type? : string;
	public handlerPlayer2Type? : string;

	constructor(
		public readonly server : PongSocketServer,
		public readonly mode : GameMode,
		public botLevel : number,
		public readonly ballSpeedIncrement : number,
		public updatePlayerTwoPos : (data : Player | GameConfig, arg : PongSocketServer | number) => void
	) { }

	public abstract updatePlayerOnePos(playerOne : Player) : void;
	public abstract isBallOnPlayer1Side(gameConfig : GameConfig) : boolean;
	public abstract getPaddleReboundRad(ball : ABall, player : Player) : number;
	public abstract changeBallDirection(gameConfig : GameConfig, angle : number) : void;

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
	constructor(
		private gameConfig : GameConfig,
		private settingsConfig : ASettingsConfig,
		private engineConfig : AEngineConfig
	) { }

	//////////////////
	// CALCULATIONS //
	//////////////////

	private static onFrontCollision(gameConfig : GameConfig) : void
	{
		gameConfig.court.onFrontalCollision(gameConfig.player1,
			gameConfig.player2, gameConfig.ball, gameConfig.court.width);
	}

	private static onBorderCollision(gameConfig : GameConfig) : void
	{
		if (gameConfig.court.onLateralCollision(gameConfig.ball, gameConfig.court.height))
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
		engineConfig.updatePlayerOnePos(gameConfig.player1);

		const mode = engineConfig.mode;

		engineConfig.updatePlayerTwoPos(
			mode == GameMode.SINGLEPLAYER
			? gameConfig : gameConfig.player2,
			mode == GameMode.SINGLEPLAYER
			? engineConfig.botLevel : engineConfig.server
		);
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
