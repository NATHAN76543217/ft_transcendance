import {
    AStyle,
    ColorStyle
} from "../../../customization"
import {
    ACourt,
    IPlayer,
} from "../../../game_objs"
import {
    Circle
} from "../../../shapes"

class ClassicPongCourt extends ACourt
{
    constructor(canvasName : string, style : AStyle)
    { super(canvasName, style); }

    onFrontalCollision(player1 : IPlayer, player2 : IPlayer, ball : Circle, courtWidth : number) : void
    { ACourt.onFrontalCollisionHorizontal(player1, player2, ball, courtWidth); }

    onLateralCollision(ball : Circle, courtHeight : number) : boolean
    { return ACourt.onLateralCollisionHorizontal(ball, courtHeight); }
}

const NAME : string = "ClassicPong";
const COURT_COLOR : string = "BLACK";

export const COURT : ClassicPongCourt = new ClassicPongCourt(NAME, new ColorStyle(COURT_COLOR));
