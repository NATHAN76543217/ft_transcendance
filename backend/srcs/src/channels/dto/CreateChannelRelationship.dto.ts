import { IsString, IsNotEmpty, IsOptional, IsNumberString, IsBoolean, IsNumber } from "class-validator";
import { ChannelRelationshipTypes } from '../relationships/channelRelationshipTypes'

export default class CreateChannelRelationshipDto {
    @IsNumberString()
    @IsNotEmpty()
    public channel_id: string;

    @IsNumberString()
    @IsNotEmpty()
    public user_id: string;

    @IsString()
    @IsNotEmpty()
    public user_name: string;

    // @IsOptional()
    @IsNumber()
    public type: ChannelRelationshipTypes;
}