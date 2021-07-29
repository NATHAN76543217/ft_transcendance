// same document in backend

import { IUser } from "./IUser";

export default interface UserPageState {
  // id: number;
  doesUserExist: boolean;
  user: IUser;
  usernameErrorMessage: string;
}
