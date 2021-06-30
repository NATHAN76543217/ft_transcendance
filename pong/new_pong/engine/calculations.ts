import {
    DynamicDto,
    IDynamicPlayerDto
} from "../dto/dynamic.dto"
import {
    APolimorphicLib
} from "./polimorphiclib"

export default function calcGameStatus(status : DynamicDto, lib : APolimorphicLib)
{
    // Check if a player scored
    lib.onFrontalCourtCollision(status);

    // Check if the ball rebound in the court's border
    if (lib.onLateralCourtCollision(status))
        lib.onLaterallBallColision(status);

    // Mouve the ball
    status.ball.add(status.ball.velocity);

    // Mouve the players
    lib.updatePlayerOnePos(status.playerOne);
    lib.updatePlayerTwoPos(status, lib.level);

    // Calculate which player is able to kick the ball
    const player : IDynamicPlayerDto = lib.isBallOnLeftSide(status.ball)
        ? status.playerOne : status.playerTwo;

    // If this player kicks the ball
    if (lib.onPaddleCollision(player, status))
    {
        // Ball should change it directional angle, perform a rebound
        lib.updateBallVelocity(status, lib.calcBallReboundOnPaddle(status.ball, player));
        status.ball.speed = lib.ballSpeedIncrement;
    }

    return (status);
}