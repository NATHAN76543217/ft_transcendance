import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsBoolean,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { UserStatus } from '../utils/userStatus';

export default class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Matches('^([0-9a-z-_])+')
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
