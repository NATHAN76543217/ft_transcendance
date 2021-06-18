import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";

export default class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    public name : string;

    @IsOptional()
    @IsNumber()
    public nbWin: number = 0;

    @IsOptional()
    @IsNumber()
    public nbLoss: number = 0;

    @IsOptional()
    @IsNumber()
    public stats: number = 0;

    @IsOptional()
    @IsString()
    public imgPath: string = "";

    @IsOptional()
    @IsBoolean()
    public twoFactorAuth: boolean = false;

    @IsOptional()
    @IsString()
    public status: string = "";
}