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
import { NameValidator } from 'src/utils/NameValidator';
import { UserStatus } from '../utils/userStatus';

const fieldName = 'Username'

export default class CreateUserDto {
  // @NameValidator('Username')
  @IsString({ message: `${fieldName} is invalid!` })
  @IsNotEmpty({ message: `${fieldName} cannot be empty!` })
  @Matches('^([0-9a-z\\-\\_])+$', undefined, {
    message: `${fieldName} is invalid!`
  })
  @Length(1, 15)
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
