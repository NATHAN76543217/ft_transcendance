import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
export interface AppState {
  relationshipsList: AppUserRelationship[]
  user?: AuthenticatedUser;
}
