import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export default class RegisterWithPasswordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  imgPath: string;
}
