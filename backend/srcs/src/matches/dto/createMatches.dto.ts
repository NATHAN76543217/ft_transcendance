import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDateString
} from "class-validator"

export default class CreateMatchesDto
{
    @IsNumber()
    @IsNotEmpty()
    public readonly idMatch : number;

    @IsString()
    @IsNotEmpty()
    public readonly idPlayerOne : string;

    // @IsString()
    // @IsNotEmpty()
    // public readonly idPlayerTwo : string;

    // @IsNumber()
    // @IsOptional()
    // public scorePlayerOne : number;

    @IsNumber()
    @IsOptional()
    public scorePlayerTwo : number;

    @IsDateString()
    @IsNotEmpty()
    public readonly startTime : Date;

    // @IsDateString()
    // @IsOptional()
    // public endTime : Date;
}
