import { UserRelationshipTypes } from 'src/users/relationships/userRelationshipTypes';
import { MessageType } from '../message.entity';

export default interface UpdateRelationshipDto {
  user_id: number;
  type: UserRelationshipTypes;
}
