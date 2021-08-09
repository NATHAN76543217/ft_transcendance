import {
  IsString,
  IsOptional,
  IsNumber,
  Length,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { NameValidator } from 'src/utils/NameValidator';
import { ChannelMode } from '../utils/channelModeTypes';

const fieldName = 'Username'

export class UpdateChannelDto {
  @IsOptional()
  // @NameValidator('Channel name')
  @IsString({ message: `${fieldName} is invalid!` })
  @IsNotEmpty({ message: `${fieldName} cannot be empty!` })
  @Matches('^([0-9a-z\\-\\_])+$', undefined, {
    message: `${fieldName} is invalid!`
  })
  @Length(1, 15)
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  mode: ChannelMode;
}
