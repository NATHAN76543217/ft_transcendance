import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsNumberString,
  Length,
  Matches,
} from 'class-validator';
import { ChannelMode } from '../utils/channelModeTypes';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Matches('^([0-9a-z-_])+')
  name: string;

  @IsString()
  @IsOptional()
  // @Length(1, 15)
  password: string;

  // @IsNumber()
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  mode: ChannelMode;
}
