import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export default class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    public name : string;

    @IsOptional()
    public nbWin: number;

    @IsOptional()
    public nbLoss: number;

    @IsOptional()
    public stats: number;

    @IsOptional()
    public imgPath: string;

    @IsOptional()
    public twoFactorAuth: boolean;

    @IsOptional()
    public status: string;
}