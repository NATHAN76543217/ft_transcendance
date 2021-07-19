
// TO DO: import shared from module

import {
    AStyle,
    ColorStyle
} from "../../../render/style"
import {
    Score,
    IScore
} from "../../../game/score"
import {
    Player,
    IPlayer
} from "../../../game/player"
import {
    Ball,
    IBall,
    IDefaultBall
} from "../../../game/ball"
import {
    Net,
    INet,
    Direction
} from "../../../game/net"
import {
    Vector2D,
    IVector2D
} from "../../../shapes/vector2d"
import {
    COURT
} from "./classicpong.courtintance"
import {
    GameStatus
} from "../../../game/status"

const SCORE_COLOR : string = "WHITE";
const SCORE_FONT : string = "75px Arial";
const PLAYER1_COLOR : string = "WHITE";
const PLAYER2_COLOR : string = "WHITE";
const PLAYERS_WIDTH : number = 10;
const PLAYERS_HEIGHT : number = 100;
const BALL_COLOR : string = "RED";
const BALL_RAD : number = 10;
const BALL_SPEED : number = 7;
const NET_COLOR : string = "WHITE";

class ClassicPongScore1 extends IScore
{
    score : number = 0;
    color : string = SCORE_COLOR;
    font : string = SCORE_FONT;

    constructor() { super(COURT.width / 4, COURT.height / 5); }
}

class ClassicPongScore2 extends IScore
{
    score : number = 0;
    color : string = SCORE_COLOR;
    font : string = SCORE_FONT;

    constructor() { super(3 * COURT.width / 4, COURT.height / 5); }
}

class ClassicPongPlayer1 extends IPlayer
{
    pos : IVector2D = new Vector2D(0, (COURT.height - 100) / 2);
    width : number = PLAYERS_WIDTH;
    height : number = PLAYERS_HEIGHT;
    style : AStyle = new ColorStyle(PLAYER1_COLOR);
    limitLeft : IVector2D = new Vector2D(0,0); // TODO
    limitRight : IVector2D = new Vector2D(0,0); // TODO
    score : Score = new Score(new ClassicPongScore1());
}

class ClassicPongPlayer2 extends IPlayer
{
    pos : IVector2D = new Vector2D(COURT.width - PLAYERS_WIDTH, (COURT.height - 100) / 2);
    width : number = PLAYERS_WIDTH;
    height : number = PLAYERS_HEIGHT;
    style : AStyle = new ColorStyle(PLAYER2_COLOR);
    limitLeft : IVector2D = new Vector2D(0,0); // TODO
    limitRight : IVector2D = new Vector2D(0,0); // TODO
    score : Score = new Score(new ClassicPongScore2()); 
}

// TO DO: Perhabs need a file for this class
class ClassicPongPlayer extends Player
{
    constructor(
        public readonly id : string,
        player : IPlayer
    )
    { super(player); }
}

class ClassicPongBall extends Vector2D implements IBall
{
    rad : number = BALL_RAD;
    style : AStyle = new ColorStyle(BALL_COLOR);
    velocity : IVector2D = new Vector2D(5, 5);
    speed : number = BALL_SPEED;
    defaultBall : IDefaultBall = this;

    constructor() { super(COURT.width / 2, COURT.height / 2); }
}

class ClassicPongNet extends INet
{
    pos : IVector2D = new Vector2D((COURT.width - this.width) / 2, 0);
    width : number = 2;
    height : number = 10;
    style : AStyle = new ColorStyle(NET_COLOR);
    direction : Direction = Direction.VERTICAL;
}

export default class ClassicPongGameConfig extends GameStatus
{
    constructor(idPlayerOne : string, idPlayerTwo : string)
    {
        super(
            COURT,
            new Player(
                new ClassicPongPlayer(
                    idPlayerOne,
                    new ClassicPongPlayer1()
                    )
                ),
            new Player(
                new ClassicPongPlayer(
                    idPlayerTwo,
                    new ClassicPongPlayer2()
                    )
                ),
            new Ball(
                new ClassicPongBall()
            ),
            new Net(
                new ClassicPongNet()
            )
        );
    }
}
