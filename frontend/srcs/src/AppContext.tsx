import React from "react";
import IUser from "./components/interface/IUserInterface";
import { IAppContext } from "./IAppContext";

const AppContext = React.createContext<IAppContext>({
  user: undefined,
  relationshipsList: [],
  updateAllRelationships: () => {},
  setUser: (user?: IUser) => {},
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
