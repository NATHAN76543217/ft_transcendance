import { IsOptional, IsNumber } from 'class-validator';
import { ChannelRelationshipType } from '../relationships/channel-relationship.type';

export default class DeleteChannelRelationshipDto {

  @IsOptional()
  public channel_id: number
  
  @IsOptional()
  public user_id: number

}
