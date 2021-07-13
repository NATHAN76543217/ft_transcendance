import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";

export interface IAppContext {
  relationshipsList: AppUserRelationship[];
  user?: AuthenticatedUser;
  setUser: (user?: AuthenticatedUser) => void;
  updateAllRelationships: () => void;
}
