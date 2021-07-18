import { Socket } from "socket.io-client";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";

export interface IAppContext {
  relationshipsList: AppUserRelationship[];
  user?: AuthenticatedUser;
  setUser: (user?: AuthenticatedUser) => void;
  updateAllRelationships: () => void;
  socket: Socket | undefined;
}
