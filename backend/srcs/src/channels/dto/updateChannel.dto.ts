import { IsString, IsNotEmpty, IsNumberString, IsOptional, IsNumber } from 'class-validator';
import { ChannelModeTypes } from '../utils/channelModeTypes';

export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsNumber()
    @IsOptional()
    mode: ChannelModeTypes;
}
