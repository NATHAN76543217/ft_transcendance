import {
    IRangeDto
} from "./dto/range"

export default class SettingsLimits
{
    constructor(
        public readonly colorLimit : IRangeDto,
        public readonly playerOneWidth : IRangeDto,
        public readonly playerOneHeight : IRangeDto,
        public readonly playerTwoWidth : IRangeDto,
        public readonly playerTwoHeight : IRangeDto,
        public readonly ballSpeed : IRangeDto
    )
    { }
}