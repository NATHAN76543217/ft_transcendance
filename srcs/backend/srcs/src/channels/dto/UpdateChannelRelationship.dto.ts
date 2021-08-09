import { IsOptional, IsNumber } from 'class-validator';
import { ChannelRelationshipType } from '../relationships/channel-relationship.type';

export default class UpdateChannelRelationshipDto {
  @IsOptional()
  // @IsNumber()
  public type: ChannelRelationshipType;

  @IsOptional()
  public channel_id: number
  
  @IsOptional()
  public user_id: number

}
