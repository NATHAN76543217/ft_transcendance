import {
    IBaseVector2D
} from "../shapes/vector2d"

interface IDynamicScore
{
    points : number;
}

export interface IDynamicPlayerDto extends IBaseVector2D
{
    score : IDynamicScore;
}

export interface IDynamicBallDto extends IBaseVector2D
{
    velocity : IBaseVector2D;
    speed : number;
}

export interface IDynamicDto
{
    playerOne : IDynamicPlayerDto;
    playerTwo : IDynamicPlayerDto;
    ball : IDynamicBallDto;
}

export class DynamicDto implements IDynamicDto
{
    constructor(
        public playerOne : IDynamicPlayerDto,
        public playerTwo : IDynamicPlayerDto,
        public ball : IDynamicBallDto
    )
    { }
}