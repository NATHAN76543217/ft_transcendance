import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { UserRole } from '../utils/userRole';
import { UserStatus } from '../utils/userStatus';

const fieldName = 'Username'

export default class UpdateUserDto {
  @IsOptional()
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
