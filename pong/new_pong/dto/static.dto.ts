import {
    IVector2D
} from "../shapes/vector2d"
import {
    IDefaultBall
} from "../game/ball"

export interface IStaticPlayerDto
{
    id : string;
    width : number;
    height : number;
    limitLeft : IVector2D;
    limitRight : IVector2D;
}

export interface IStaticBallDto
{
    rad : number;
    defaultBall : IDefaultBall;
}

export interface IStaticCourtDto
{
    width : number;
    height : number;
}

export interface IStaticDto
{
    playerOne : IStaticPlayerDto;
    playerTwo : IStaticPlayerDto;
    ball : IStaticBallDto;
    court : IStaticCourtDto;
}

export class StaticDto implements IStaticDto
{
    constructor(
        public playerOne : IStaticPlayerDto,
        public playerTwo : IStaticPlayerDto,
        public ball : IStaticBallDto,
        public court : IStaticCourtDto
    )
    { }
}
