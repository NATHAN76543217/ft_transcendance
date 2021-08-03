import { Socket } from "socket.io-client";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { IUser } from "./models/user/IUser";
export interface AppState {
  user?: IUser;
  relationshipsList: AppUserRelationship[];
  eventSocket?: Socket;
}
