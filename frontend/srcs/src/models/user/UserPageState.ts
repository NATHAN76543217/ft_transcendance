// same document in backend

import { IUser } from "./IUser";
import { UserRelationshipType } from "./UserRelationship";

export default interface UserPageState {
  // id: number;
  doesUserExist: boolean;
  user: IUser;
  usernameErrorMessage: string;
}
