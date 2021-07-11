import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import { IUser } from "./models/user/IUser";

export interface IAppContext {
  relationshipsList: IUser[];
  user?: AuthenticatedUser;
  setUser: (user?: AuthenticatedUser) => void;
  updateAllRelationships: () => void;
}