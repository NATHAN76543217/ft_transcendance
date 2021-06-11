import { Player, ABall, GameConfig } from "./game_objs";

///////////////////
// Single Player //
///////////////////

function pongBot(bot : Player, ball : ABall, level : number)
{ bot.pos.y += ((ball.pos.y - (bot.pos.y + bot.height / 2))) * level; }

/////////////////////////////////////
// Horizontal abstract definitions //
/////////////////////////////////////

function isBallOnLeftCourtSideHorizontal(gameConfig : GameConfig) : Boolean
{
	return (gameConfig.ball.pos.x + gameConfig.ball.rad
		< gameConfig.court.width / 2);
}

function calcPaddleReboundRadHorizontal(ball : ABall, player : Player) : number
{
	/// Get a in radian the normalized angle
	/// Default angles:
	/// -45 (-PI / 4) (ball hit on the top)
	/// 0 (ball hit on the middle)
	/// 45 (PI / 4) (ball hit on the bottom)
	return (((ball.pos.y - (player.pos.y + player.height / 2)) // Get value
	/ player.height / 2) * (Math.PI / 4)); // Normalize it and convert to rads
}

function changeBallDirHorizontal(gameConfig : GameConfig, angle : number) : void
{
	const direction : number = (gameConfig.ball.pos.x + gameConfig.ball.rad
		< gameConfig.court.width / 2) ? 1 : -1;

	gameConfig.ball.velocity.x = direction * gameConfig.ball.speed * Math.cos(angle);
	gameConfig.ball.velocity.y = gameConfig.ball.speed * Math.sin(angle);
}

///////////////////////////////////
// Vertical abstract definitions //
///////////////////////////////////

function isBallOnLeftCourtSideVertical(gameConfig : GameConfig) : Boolean
{
    return true;
}

function calcPaddleReboundRadVertical(ball : ABall, player : Player) : number
{
    return 1;
}

function changeBallDirVertical(gameConfig : GameConfig, angle : number) : void
{

}

