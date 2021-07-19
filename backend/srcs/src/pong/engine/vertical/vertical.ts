import {
    GameMode
} from "shared-pong/utils/gamemode";
import {
    IDynamicBallDto,
    IDynamicDto,
    IDynamicPlayerDto
} from "shared-pong/dto/dynamic.dto"
import {
    IStaticDto
} from "shared-pong/dto/static.dto";
import {
    IVector2D
} from "shared-pong/shapes/vector2d"
import {
    APolimorphicLib
} from "../polimorphiclib"
import {
    PongSocketServer
} from "../../server/socketserver"

export default abstract class AVerticalLib extends APolimorphicLib
{
    // Should only implement THE VERTICAL FUNCTIONS
    // Other can be let abstract

    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    abstract updatePlayerTwoPos(status : IDynamicDto, level? : number) : void;

    updatePlayerOnePos(playerOne : IVector2D)
    {
        
    }

    isBallOnLeftSide(status : IDynamicBallDto)
    {
        return true;
    }

    calcBallReboundOnPaddle(ball : IDynamicBallDto, player : IDynamicPlayerDto)
    {
        return 42420;
    }

    updateBallVelocity(status : IDynamicDto, angle : number)
    {

    }

    onFrontalCourtCollision(status : IDynamicDto)
    {

    }

    onLateralCourtCollision(status : IDynamicDto)
    {
        return true;
    }

    onFrontalBallColision(status : IDynamicDto)
    {

    }

    onLaterallBallColision(status : IDynamicDto)
    {

    }

    onPaddleCollision(pladdle : IDynamicPlayerDto, status : IDynamicDto)
    {
        return true;
    }

}