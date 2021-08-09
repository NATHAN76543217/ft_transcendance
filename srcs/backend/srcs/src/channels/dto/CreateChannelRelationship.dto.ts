import { IsNotEmpty, IsNumberString, IsNumber } from 'class-validator';
import { ChannelRelationshipType } from '../relationships/channel-relationship.type';

export default class CreateChannelRelationshipDto {
  // This should be fetched on creation after checking that the creating user
  // is allowed to manage this channel

  @IsNumber()
  @IsNotEmpty()
  public channel_id: number;

  @IsNumber()
  @IsNotEmpty()
  public user_id: number;

  // This should be fetched on creation
  /*     @IsString()
    @IsNotEmpty()
    public user_name: string; */

  // @IsOptional()
  @IsNumber()
  public type: ChannelRelationshipType;
}
