// same document in backend

import { IUser } from "./IUser";
import { UserRelationshipType } from "./UserRelationship";

export default interface UserSearchState {
  list: {
    user: IUser,
    relationType: UserRelationshipType
  }[];
  username: string;
}
