import {
    IVector2D
} from "../shapes/vector2d"
import {
    IDynamicBallDto,
    IDynamicDto,
    IDynamicPlayerDto
} from "../dto/dynamic.dto"
import {
    IStaticDto
} from "../dto/static.dto"
import {
    PongSocketServer
} from "../server/socketserver"

export enum GameMode
{
    SINGLE_PLAYER,
    MULTI_PLAYER
}

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