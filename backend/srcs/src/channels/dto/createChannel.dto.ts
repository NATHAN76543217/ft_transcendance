import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { ChannelModeTypes } from "../utils/channelModeTypes";

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    password: string;
    
    @IsNumber()
    @IsNotEmpty()
    mode: ChannelModeTypes;
}
