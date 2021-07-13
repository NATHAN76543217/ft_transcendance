import { IUser } from "./IUser";
import { UserRelationshipType } from "./UserRelationship";

export interface AppUserRelationship {
  user: IUser,
  relationshipType: UserRelationshipType
}

