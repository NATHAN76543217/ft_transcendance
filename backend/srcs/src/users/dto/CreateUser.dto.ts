import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsBoolean,
  IsNumber,
  Length,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { UserStatus } from '../utils/userStatus';

export default class CreateUserDto {
  @NameValidator('Username')
  public name: string;

  @IsString()
  @IsOptional()
  @Length(4, 64)
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
  public status?: UserStatus;
}
