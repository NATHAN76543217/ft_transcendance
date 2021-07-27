import {
    IBaseVector2D
} from "../shapes/vector2d"
import {
    IDefaultBall
} from "../game/ball"
import {
    Score
} from "../game/score"

export interface IStaticPlayerDto
{
    id : string;
    width : number;
    height : number;
    limitLeft : IBaseVector2D;
    limitRight : IBaseVector2D;
    score: number | Score; // TO DO: FIX THIS, WHY DO I NEED SCORE FOR STATIC DTO ? 
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
