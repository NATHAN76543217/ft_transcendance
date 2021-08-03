import { Socket } from "socket.io-client";
import { Message } from "./models/channel/Channel";
import { AppUserRelationship } from "./models/user/AppUserRelationship";
import { IUser } from "./models/user/IUser";
import { UserRelationshipType } from "./models/user/UserRelationship";

export interface IAppContext {
  relationshipsList: AppUserRelationship[];
  user?: IUser;
  token?: string;
  setUser: (user?: IUser) => void;
  setUserInit: (user?: IUser) => void;
  updateOneRelationshipType: (
    user_id: number,
    newType: UserRelationshipType
  ) => void;
  updateOneRelationshipGameInvite: (message: Message) => void;
  eventSocket?: Socket;
  matchSocket?: Socket;
}
