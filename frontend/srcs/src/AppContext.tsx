import React from "react";
import { Socket } from "socket.io-client";
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
