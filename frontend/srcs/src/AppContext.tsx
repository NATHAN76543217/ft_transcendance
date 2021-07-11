import React from "react";
import { AuthenticatedUser } from "./models/user/AuthenticatedUser";
import { IAppContext } from "./IAppContext";

const AppContext = React.createContext<IAppContext>({
  user: undefined,
  relationshipsList: [],
  updateAllRelationships: () => {},
  setUser: (user?: AuthenticatedUser) => {},
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
