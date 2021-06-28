import {
    Player
} from "../game/player"
import {
    Ball
} from "../game/ball"
import {
    Court
} from "../game/court"

export interface IGameStatus
{
    court : Court;
    playerOne : Player;
    playerTwo : Player;
    ball : Ball;
}

export class GameStatus implements IGameStatus
{
    constructor(
        public court : Court,
        public playerOne : Player,
        public playerTwo : Player,
        public ball : Ball
    )
    { }

    // TO DO: Sanitize function that checks the limits and input coherence
}