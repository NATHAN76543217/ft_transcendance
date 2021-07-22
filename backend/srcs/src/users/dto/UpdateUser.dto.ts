import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBoolean, Length } from "class-validator";
import { UserRole } from "../utils/userRole";
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
	// @IsNumber()
    public status: UserStatus;

    @IsOptional()
	// @IsNumber()
    public role: UserRole;
}