import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsNumberString,
  Length,
  Matches,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { ChannelMode } from '../utils/channelModeTypes';

export class CreateChannelDto {
  @NameValidator('Channel name')
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
