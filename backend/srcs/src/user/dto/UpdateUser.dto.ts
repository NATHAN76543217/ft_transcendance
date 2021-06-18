import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBoolean } from "class-validator";

export default class UpdateUserDto {
	@IsNotEmpty()
    @IsNumberString()
    public id: number;

	@IsOptional()
    @IsString()
    public name: string;

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
	@IsBoolean()
    public twoFactorAuth: boolean;

	@IsOptional()
	@IsString()
    public status: string;
}