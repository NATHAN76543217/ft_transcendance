import { IsNotEmpty, IsNumberString, IsNumber } from 'class-validator';
import { ChannelRelationshipTypes } from '../relationships/channelRelationshipTypes';

export default class CreateChannelRelationshipDto {
  // This should be fetched on creation after checking that the creating user
  // is allowed to manage this channel

  /* @IsNumberString()
    @IsNotEmpty()
    public channel_id: string; */

  @IsNumberString()
  @IsNotEmpty()
  public user_id: string;

  // This should be fetched on creation
  /*     @IsString()
    @IsNotEmpty()
    public user_name: string; */

  // @IsOptional()
  @IsNumber()
  public type: ChannelRelationshipTypes;
}
