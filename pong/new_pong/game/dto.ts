import {
    IVector2D
} from "../shapes/vector2d";

export interface IGameStatus
{
    playerOne : IVector2D;
    playerTwo : IVector2D;
    playerOneScored : boolean;
    playerTwoScored : boolean;
}