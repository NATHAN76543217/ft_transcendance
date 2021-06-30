import {
    Court
} from "../../../game/court"
import {
    ColorStyle
} from "../../../render/style"

const NAME : string = "pongCanvas";
const COURT_COLOR = "BLACK";

export const COURT = new Court(NAME, new ColorStyle(COURT_COLOR));
