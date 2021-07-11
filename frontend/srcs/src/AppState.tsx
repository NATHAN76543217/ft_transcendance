import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import { IUser } from "./models/user/IUser";
export interface AppState {
  relationshipsList: IUser[];
  user?: AuthenticatedUser;
}
