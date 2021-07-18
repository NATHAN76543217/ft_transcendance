
// TO DO: import shared from module

import {
    IRange
} from "../../../../../../shared/pong/dto/range.dto"

export default class SettingsLimits
{
    constructor(
        public readonly colorLimit : IRange,
        public readonly playerOneWidth : IRange,
        public readonly playerOneHeight : IRange,
        public readonly playerTwoWidth : IRange,
        public readonly playerTwoHeight : IRange,
        public readonly ballSpeed : IRange
    )
    { }
}
