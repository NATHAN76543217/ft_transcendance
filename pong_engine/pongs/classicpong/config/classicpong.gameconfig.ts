import {
    AStyle,
    ColorStyle,
    Direction
} from "../../../customization";
import {
    Score,
    IScore,
    Player,
    IPlayer,
    ABall,
    IBall,
    ACourt,
    Net,
    INet,
    GameConfig
} from "../../../game_objs";
import {
    IPoint,
    Point,
    Circle
} from "../../../shapes";
import {
    COURT
} from "./classicpong.court.instance"

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
    x : number = COURT.width / 4;
    y : number = COURT.height / 5;
    score : number = 0;
    color : string = SCORE_COLOR;
    font : string = SCORE_FONT;
}

class ClassicPongScore2 extends IScore
{
    x : number = 3 * COURT.width / 4;
    y : number = COURT.height / 5;
    score : number = 0;
    color : string = SCORE_COLOR;
    font : string = SCORE_FONT;
}

class ClassicPongPlayer1 extends IPlayer
{
    pos : IPoint = new Point(0, (COURT.height - 100) / 2);
    width : number = PLAYERS_WIDTH;
    height : number = PLAYERS_HEIGHT;
    style : AStyle = new ColorStyle(PLAYER1_COLOR);
    limitLeft : IPoint = new Point(0,0); // TODO
    limitRight : IPoint = new Point(0,0); // TODO
    score : Score = new Score(new ClassicPongScore1());
}

class ClassicPongPlayer2 extends IPlayer
{
    pos : IPoint = new Point(COURT.width - PLAYERS_WIDTH, (COURT.height - 100) / 2);
    width : number = PLAYERS_WIDTH;
    height : number = PLAYERS_HEIGHT;
    style : AStyle = new ColorStyle(PLAYER2_COLOR);
    limitLeft : IPoint = new Point(0,0); // TODO
    limitRight : IPoint = new Point(0,0); // TODO
    score : Score = new Score(new ClassicPongScore2()); 
}

class ClassicPongIBall extends IBall
{
    pos : IPoint = new Point(COURT.width / 2, COURT.height / 2);
    rad : number = BALL_RAD;
    style : AStyle = new ColorStyle(BALL_COLOR);
    velocity : IPoint = new Point(5, 5);
    speed : number = BALL_SPEED;
    defaultBall : IBall = this;
}

class ClassicPongBall extends ABall
{
    constructor(ball : IBall)
    {
        super(ball.pos, ball.rad, ball.style, ball.velocity,
            ball.speed, ball.defaultBall);
    }

    frontalRebound() : void
    {
        // TODO
    }

    lateralRebound() : void
    {
        // TODO
    }
}

class ClassicPongNet extends INet
{
    pos : IPoint = new Point((COURT.width - this.width) / 2, 0);
    width : number = 2;
    height : number = 10;
    style : AStyle = new ColorStyle(NET_COLOR);
    direction : Direction = Direction.VERTICAL;
}

export default class ClassicPongGameConfig extends GameConfig
{
    constructor()
    {
        super(
            COURT,
            new Player(new ClassicPongPlayer1()),
            new Player(new ClassicPongPlayer2()),
            new ClassicPongBall(new ClassicPongIBall()),
            new Net(new ClassicPongNet())
        );
    }
}
