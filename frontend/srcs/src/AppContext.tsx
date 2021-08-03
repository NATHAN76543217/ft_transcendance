import React from "react";
import { IAppContext } from "./IAppContext";

const AppContext = React.createContext<IAppContext>({
  setUser: () => {},
  setUserInit: () => {},
  relationshipsList: [],
  updateOneRelationshipType: () => {},
  updateOneRelationshipGameInvite: () => {},
  eventSocket: undefined,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
