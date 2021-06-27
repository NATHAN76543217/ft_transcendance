import {
    IVector2D
} from "../shapes/vector2d";

export interface IGameDto
{
    playerOne : IVector2D;
    playerTwo : IVector2D;
}

// TO DO: End this containig all the dto data
// Make another for constanst (or the same)
// Make another onw for the style and frontend calculations that are not important