import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { UserRole } from '../utils/userRole';
import { UserStatus } from '../utils/userStatus';

export default class UpdateUserDto {
  @IsOptional()
  @NameValidator('Username')
  public name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(4, 64)
  public password: string;

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
