import IUserInterface from "./components/interface/IUserInterface";
export interface AppStates {
  relationshipsList: IUserInterface[];
  //myRole: UserRoleTypes,
  user?: IUserInterface;
  // TODO: This could be replaced by a function or inferred by user undefinedness
  //logged: boolean,
}
