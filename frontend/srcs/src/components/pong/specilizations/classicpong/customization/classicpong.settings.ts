
// TO DO: import shared from module

import SettingsLimits from "../../../settings/limits"
import {
    Range
} from "../../../../../../../../shared/pong/dto/range.dto"
import {
    COURT
} from "./classicpong.courtintance"

const MIN_COLOR_VALUE : number = 0x00000000;
const MAX_COLOR_VALUE : number = 0x00FFFFFF;
const MIN_PLAYER_WIDTH : number = COURT.width / 40;
const MAX_PLAYER_WIDTH : number = COURT.width / 20;
const MIN_PLAYER_HEIGHT : number = COURT.height / 10;
const MAX_PLAYER_HEIGHT : number = COURT.height / 5;
const MIN_BALL_SPEED : number = 1;
const MAX_BALL_SPEED : number = 40;

export default class ClassicPongSettingsLimits extends SettingsLimits
{
    constructor()
    {
        super(
            new Range(MIN_COLOR_VALUE, MAX_COLOR_VALUE),
            new Range(MIN_PLAYER_WIDTH, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_HEIGHT, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_WIDTH, MAX_PLAYER_WIDTH),
            new Range(MIN_PLAYER_HEIGHT, MAX_PLAYER_HEIGHT),
            new Range(MIN_BALL_SPEED, MAX_BALL_SPEED)
        )
        { }
        //this.checkRanges(COURT.canvas);
        // TO DO: A developper error check
    }
}
