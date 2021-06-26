import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";

export default class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    public name : string;

    @IsString()
    @IsOptional()
    public password?: string;

    @IsOptional()
    @IsNumberString()
    public nbWin?: number;

    @IsOptional()
    @IsNumberString()
    public nbLoss?: number;

    @IsOptional()
    @IsNumber()
    public stats?: number;

    @IsString()
    @IsOptional()
    public imgPath?: string;

    @IsOptional()
    @IsBoolean()
    public twoFactorAuth?: boolean;
    

    @IsNumber()
    @IsOptional()
    public school42id?: number;

    @IsString()
    @IsOptional()
    public googleid?: string;

    @IsOptional()
    @IsString()
    public status?: string;
}