import { UserRelationshipTypes } from '../users/userRelationshipTypes';

export default interface IUserRelationship {
    id: number;
    type: UserRelationshipTypes;
    user1_id: number;
    user2_id: number;
}