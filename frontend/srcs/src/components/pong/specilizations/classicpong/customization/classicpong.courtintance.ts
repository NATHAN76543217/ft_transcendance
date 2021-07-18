
// TO DO: import shared from module

import {
    Court
} from "../../../../../../../../shared/pong/game/court"
import {
    ColorStyle
} from "../../../../../../../../shared/pong/render/style"

const NAME : string = "pongCanvas";
const COURT_COLOR = "BLACK";

export const COURT = new Court(NAME, new ColorStyle(COURT_COLOR));
