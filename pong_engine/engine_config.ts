
// FOR THE FUTURE:
// BUILD FAST CONFIG CLASS USING JSON TO JS OBJ
// source: https://stackoverflow.com/questions/52315147/json-to-javascript-class

// NOTE THIS WOULD BE A DIR, EACH FILE IN THE DIR WILL
//  BE A DIFFERENT KINK OF PONG

import { Score, IScore } from "./game_objs"

// const score = class {
//     x : number = 0;
//     y : number = 0;
//     color : string = "";
//     font : string = "";
// };

class score extends IScore
{
    x : number = 0;
    y : number = 0;
    score : number;
    color : string = "";
    font : string = "";
}

new Score(new score());

