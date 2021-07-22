import {
  IsString,
  IsOptional,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { ChannelMode } from '../utils/channelModeTypes';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  @Length(1, 15)
  @Matches('^([0-9a-z-_])+')
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  mode: ChannelMode;
}
