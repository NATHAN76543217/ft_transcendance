import React from "react";
import { IAppContext } from "./IAppContext";

const AppContext = React.createContext<IAppContext>({
  setUser: () => {},
  relationshipsList: [],
  updateAllRelationships: () => {},
  socket: undefined,
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
