import { Socket } from "socket.io-client";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import { UserRelationshipType } from "./models/user/UserRelationship";

export interface IAppContext {
  relationshipsList: AppUserRelationship[];
  user?: AuthenticatedUser;
  token?: string;
  setUser: (user?: AuthenticatedUser) => void;
  setUserInit: (user?: AuthenticatedUser) => void;
  updateOneRelationshipType: (user_id: number, newType: UserRelationshipType) => void;
  socket?: Socket;
}
