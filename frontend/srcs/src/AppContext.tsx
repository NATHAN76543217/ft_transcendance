import React from "react";
import { IAppContext } from "./IAppContext";
import { UserRelationshipType } from "./models/user/UserRelationship";

const AppContext = React.createContext<IAppContext>({
  setUser: () => {},
  setUserInit: () => {},
  relationshipsList: [],
  updateOneRelationship: (user_id: number, newType: UserRelationshipType) => {},
  socket: undefined,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
