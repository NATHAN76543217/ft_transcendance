import { IsString, IsNotEmpty,IsNumberString, IsOptional, IsBooleanString, IsNumber, IsBoolean } from "class-validator";
import { ChannelRelationshipTypes } from '../relationships/channelRelationshipTypes'

export default class UpdateChannelRelationshipDto {
	@IsOptional()
    @IsNumber()
    public type: ChannelRelationshipTypes;
}