import {
    IsNotEmpty,
    IsString,
    IsDigit,
    IsOptional,
    ISDateString
} from "class-validator"

export default class MatchesDto
{
    @IsDigit()
    @IsNotEmpty()
    public readonly idMatch : number;

    @IsString()
    @IsNotEmpty()
    public readonly idPlayerOne : string;

    @IsString()
    @IsNotEmpty()
    public readonly idPlayerTwo : string;

    @IsDigit()
    @IsOptional()
    public scorePlayerOne : number;

    @IsDigit()
    @IsOptional()
    public scorePlayerTwo : number;

    @ISDateString()
    @IsNotEmpty()
    public readonly startTime : Date;

    @ISDateString()
    @IsOptional()
    public endTime : Date;
}