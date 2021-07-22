import {
  IsString,
  IsOptional,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { ChannelMode } from '../utils/channelModeTypes';

export class UpdateChannelDto {
  @IsOptional()
  @NameValidator('Channel name')
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  mode: ChannelMode;
}
