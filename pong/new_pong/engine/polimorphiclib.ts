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

export abstract class APolimorphicLib
{
    constructor(
        public gameConfig : IStaticDto
    )
    { }

    public abstract updatePlayerOnePos(playerOne : IVector2D) : void;
    public abstract updatePlayerTwoPos(playerTwo : IVector2D) : void; // TO DO: Bot
    public abstract isBallOnRightSide(status : IDynamicBallDto) : boolean;
    public abstract calcBallReboundOnPaddle(ball : IDynamicBallDto, player : IDynamicPlayerDto) : number;
    public abstract updateBallVelocity(status : IDynamicDto, angle : number) : void;
    public abstract onFrontalCourtCollision(status : IDynamicDto) : void;
    public abstract onLateralCourtCollision(status : IDynamicDto) : boolean;
    public abstract onFrontalBallColision(status : IDynamicDto) : void;
    public abstract onLaterallBallColision(status : IDynamicDto) : void;
    public abstract onPaddleCollision(status : IDynamicDto) : boolean;
}