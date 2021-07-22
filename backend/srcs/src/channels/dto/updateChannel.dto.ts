import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { ChannelMode } from '../utils/channelModeTypes';

export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    @Length(1, 15)
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsNumber()
    @IsOptional()
    mode: ChannelMode;
}
