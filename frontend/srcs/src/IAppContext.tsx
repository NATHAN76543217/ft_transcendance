import IUser from "./components/interface/IUserInterface";
import IUserInterface from "./components/interface/IUserInterface";

export interface IAppContext {
  relationshipsList: IUserInterface[];
  // This should be provided by user now
  //	myId: string,
  //	myRole: UserRoleTypes,
  user?: IUser;
  setUser: (user?: IUser) => void;
  updateAllRelationships: () => void;
}
