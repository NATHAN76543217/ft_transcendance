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

const fieldName = 'Username'

export class CreateChannelDto {
  // @NameValidator('Channel name')
  @IsString({ message: `${fieldName} is invalid!` })
  @IsNotEmpty({ message: `${fieldName} cannot be empty!` })
  @Matches('^([0-9a-z\\-\\_])+$', undefined, {
    message: `${fieldName} is invalid!`
  })
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
  mode: ChannelMode;
}
