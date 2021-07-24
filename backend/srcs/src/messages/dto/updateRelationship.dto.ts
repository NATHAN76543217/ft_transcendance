import { UserRelationshipTypes } from 'src/users/relationships/userRelationshipTypes';

export default interface UpdateRelationshipDto {
  channel_id: number;
  user_id: number;
  type: UserRelationshipTypes;
}
