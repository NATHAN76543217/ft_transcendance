import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";

export default class CreateUserDto {
    // @IsString()
    // @IsNotEmpty()
    public name : string;

    // @IsString()
    // @IsOptional()
    public password : string;

    // @IsOptional()
    // @IsNumber()
    // public nbWin?: number;

    // @IsOptional()
    // @IsNumber()
    // public nbLoss?: number;

    // @IsOptional()
    // @IsNumber()
    // public stats?: number;

    // @IsString()
    // @IsOptional()
    public imgPath?: string;


    // @IsString()
    // @IsOptional()
    public oauth_id?: number;

    // @IsOptional()
    // @IsBoolean()
    // public twoFactorAuth?: boolean;

    // @IsOptional()
    // @IsString()
    // public status?: string;
}