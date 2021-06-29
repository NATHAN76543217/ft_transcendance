import {
    Player
} from "../game/player"
import {
    Ball
} from "../game/ball"
import {
    Court
} from "../game/court"
import {
    Net
} from "../game/net"

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
        public ball : Ball,
        public net : Net
    )
    { }

    // TO DO: Sanitize function that checks the limits and input coherence
}