import {
    ASettingsConfig
} from "../../../engine"
import {
    Range
} from "../../../frontend_objs"
import {
    COURT
} from "./classicpong.court.instance"

const MIN_PLAYER_WIDTH : number = COURT.width / 40;
const MAX_PLAYER_WIDTH : number = COURT.width / 20;
const MIN_PLAYER_HEIGHT : number = COURT.height / 10;
const MAX_PLAYER_HEIGHT : number = COURT.height / 5;
const MIN_BALL_SPEED : number = 1;
const MAX_BALL_SPEED : number = 40;

export default class ClassicPongSettingsConfig extends ASettingsConfig
{
    constructor()
    {
        super(
            new Range(MIN_PLAYER_WIDTH, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_HEIGHT, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_WIDTH, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_HEIGHT, MAX_PLAYER_WIDTH),
            new Range(MIN_BALL_SPEED, MAX_BALL_SPEED)
        )
        this.checkRanges(COURT.canvas);
    }
}