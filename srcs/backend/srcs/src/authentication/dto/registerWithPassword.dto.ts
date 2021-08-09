import { IsNotEmpty, IsString, IsOptional, Length, Matches } from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';

const fieldName = 'Username'

export default class RegisterWithPasswordDto {
  // @NameValidator('Username')
  @IsString({ message: `${fieldName} is invalid!` })
  @IsNotEmpty({ message: `${fieldName} cannot be empty!` })
  @Matches('^([0-9a-z\\-\\_])+$', undefined, {
    message: `${fieldName} is invalid!`
  })
  @Length(1, 15)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 64)
  password: string;

}
