import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean, isNotEmpty, Length } from "class-validator";
import { UserStatus } from "../utils/userStatus";

export default class UpdateUserDto {
	@IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 15)
    public name: string;
    
    @IsString()
    @IsOptional()
    @IsNotEmpty()
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
    public status: UserStatus;
}