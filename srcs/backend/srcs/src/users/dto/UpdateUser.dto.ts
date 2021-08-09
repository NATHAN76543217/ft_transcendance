import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '../utils/userRole';
import { UserStatus } from '../utils/userStatus';

const fieldName = 'Username';

export default class UpdateUserDto {
  @IsOptional()
  // @NameValidator('Username')
  @IsString({ message: `${fieldName} is invalid!` })
  @IsNotEmpty({ message: `${fieldName} cannot be empty!` })
  @Matches('^([0-9a-z\\-\\_])+$', undefined, {
    message: `${fieldName} is invalid!`,
  })
  @Length(1, 15)
  public name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(4, 64)
  public password?: string;

  @IsOptional()
  @IsNumberString()
  public nbWin?: number;

  @IsOptional()
  @IsNumberString()
  public nbLoss?: number;

  @IsOptional()
  @IsNumberString()
  public stats?: number;

  @IsOptional()
  @IsString()
  public imgPath?: string;

  // TODO: I do not think we should allow toggling this directly
  /* 
  @IsOptional()
  // @IsBooleanString()
  @IsBoolean()
  public twoFactorAuth?: boolean; */

  // TODO: I think we removed this
  /*   @IsOptional()
  // @IsNumber()
  public status: UserStatus; */

  @IsOptional()
  // @IsNumber()
  public role: UserRole;
}
