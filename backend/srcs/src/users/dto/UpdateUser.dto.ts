import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean } from "class-validator";

export default class UpdateUserDto {
	@IsOptional()
    @IsString()
    public name: string;

    @IsString()
    @IsOptional()
    public password : string;

	@IsOptional()
    @IsNumberString()
    public nbWin: number;

	@IsOptional()
    @IsNumberString()
    public nbLoss: number;

	@IsOptional()
    @IsNumberString()
    public stats: number;

	@IsOptional()
	@IsString()
    public imgPath: string;

	@IsOptional()
	// @IsBooleanString()
	@IsBoolean()
    public twoFactorAuth: boolean;

	@IsOptional()
	@IsString()
    public status: string;
}