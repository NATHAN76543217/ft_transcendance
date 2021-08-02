import React from "react";
import { IAppContext } from "./IAppContext";
import { Message } from "./models/channel/Channel";
import { UserRelationshipType } from "./models/user/UserRelationship";

const AppContext = React.createContext<IAppContext>({
  setUser: () => {},
  setUserInit: () => {},
  relationshipsList: [],
  updateOneRelationshipType: (
    user_id: number,
    newType: UserRelationshipType
  ) => {},
  updateOneRelationshipGameInvite: (message: Message) => {},
  channelSocket: undefined,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
