import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginWithPasswordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
