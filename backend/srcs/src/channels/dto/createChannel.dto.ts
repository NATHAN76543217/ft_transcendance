import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsNumberString,
  Length,
} from 'class-validator';
import { ChannelModeTypes } from '../utils/channelModeTypes';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsString()
  @IsOptional()
  // @Length(1, 15)
  password: string;

  // @IsNumber()
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  mode: ChannelModeTypes;
}
