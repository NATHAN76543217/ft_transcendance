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

    onFrontalCollision(player1 : IPlayer, player2 : IPlayer, ball : Circle) : void
    {
        // TODO
    }

    onLateralCollision(ball : Circle) : boolean
    {
        // TODO
        return true;
    }
}

const NAME : string = "ClassicPong";

const COURT_COLOR : string = "BLACK";

export const COURT : ClassicPongCourt = new ClassicPongCourt(NAME, new ColorStyle(COURT_COLOR));
