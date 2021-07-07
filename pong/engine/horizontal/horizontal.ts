import {
    GameMode
} from "../polimorphiclib"
import {
    IDynamicBallDto,
    IDynamicDto,
    IDynamicPlayerDto
} from "../../dto/dynamic.dto"
import {
    IStaticDto
} from "../../dto/static.dto"
import {
    IVector2D
} from "../../shapes/vector2d"
import {
    APolimorphicLib
} from "../polimorphiclib"
import {
    PongSocketServer
} from "../../server/socketserver"

export default abstract class AHorizontalLib extends APolimorphicLib
{
    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    abstract updatePlayerTwoPos(status : IDynamicDto, level? : number);

    updatePlayerOnePos(playerOne : IVector2D)
    {
        // to do
    }

    isBallOnLeftSide(ball : IDynamicBallDto)
    { return ball.x + this.gameConfig.ball.rad < this.gameConfig.court.width / 2; }

    calcBallReboundOnPaddle(ball : IDynamicBallDto, player : IDynamicPlayerDto)
    {
        const playerHeight : number = this.gameConfig.playerOne.height;
        return ((ball.y - (player.y + playerHeight / 2)) / playerHeight / 2) * (Math.PI / 4);
    }

    updateBallVelocity(status : IDynamicDto, angle : number)
    {
        const direction : number = status.ball.x + this.gameConfig.ball.rad
            < this.gameConfig.court.width / 2 ? 1 : -1;
        
        status.ball.velocity.x = direction * status.ball.speed * Math.cos(angle);
        status.ball.velocity.y = status.ball.speed * Math.sin(angle);
    }
            

    onFrontalCourtCollision(status : IDynamicDto)
    {
        if (status.ball.x - this.gameConfig.ball.rad < 0)
        {
            status.playerOne.score.points++;
            status.ball = this.gameConfig.ball.defaultBall;
        }
        else if (status.ball.x + this.gameConfig.ball.rad > this.gameConfig.court.width)
        {
            status.playerTwo.score.points++;
            status.ball = this.gameConfig.ball.defaultBall;
        }        
    }

    onLateralCourtCollision(status : IDynamicDto)
    {
        const ballRad : number = this.gameConfig.ball.rad;
        return status.ball.y - ballRad < 0 || status.ball.y + ballRad > this.gameConfig.court.height;
    }

    onFrontalBallColision(status : IDynamicDto)
    {
        // TO DO: I think this not exists
    }

    onLaterallBallColision(status : IDynamicDto)
    { status.ball.y = -status.ball.y; }

    onPaddleCollision(paddle : IDynamicPlayerDto, status : IDynamicDto)
    {
        const playerWitdh : number = this.gameConfig.playerOne.width;
        const playerHeight : number = this.gameConfig.playerTwo.height;
        const ballRad : number =  this.gameConfig.ball.rad;

        return (paddle.x < status.ball.x + ballRad // rectangle left < ball right
            && paddle.y < status.ball.y + ballRad // rectangle top < ball bottom
            && paddle.x + playerWitdh > status.ball.x - ballRad // rectangle right > ball left
            && paddle.y + playerHeight > status.ball.y - ballRad); // rectangle bottom > ball top
    }
}