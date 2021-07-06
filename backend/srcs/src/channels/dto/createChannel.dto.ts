import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
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
  password: string;

  @IsNumber()
  @IsNotEmpty()
  mode: ChannelModeTypes;
}
