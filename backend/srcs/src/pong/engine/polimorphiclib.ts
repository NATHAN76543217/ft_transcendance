import {
    IVector2D
} from "shared-pong/shapes/vector2d"
import {
    IDynamicBallDto,
    IDynamicDto,
    IDynamicPlayerDto
} from "shared-pong/dto/dynamic.dto"
import {
    IStaticDto
} from "shared-pong/dto/static.dto"
import {
    GameMode
} from "shared-pong/utils/gamemode"
import {
    PongSocketServer
} from "../server/socketserver"

export abstract class APolimorphicLib
{
    constructor(
        public sockServ : PongSocketServer,
        public gameConfig : IStaticDto,
        public readonly ballSpeedIncrement : number,
        public readonly mode : GameMode,
        public level? : number
    )
    { }

    public abstract updatePlayerOnePos(playerOne : IVector2D) : void;
    public abstract updatePlayerTwoPos(status : IDynamicDto, level? : number) : void;
    public abstract isBallOnLeftSide(status : IDynamicBallDto) : boolean;
    public abstract calcBallReboundOnPaddle(ball : IDynamicBallDto, player : IDynamicPlayerDto) : number;
    public abstract updateBallVelocity(status : IDynamicDto, angle : number) : void;
    public abstract onFrontalCourtCollision(status : IDynamicDto) : void;
    public abstract onLateralCourtCollision(status : IDynamicDto) : boolean;
    public abstract onFrontalBallColision(status : IDynamicDto) : void;
    public abstract onLaterallBallColision(status : IDynamicDto) : void;
    public abstract onPaddleCollision(pladdle : IDynamicPlayerDto, status : IDynamicDto) : boolean;
}
