import IUserInterface from "./components/interface/IUserInterface";
import { UserRoleTypes } from "./components/users/userRoleTypes";

export interface AppStates {
	relationshipsList: IUserInterface[],
	myId: string,
	myRole: UserRoleTypes,
}
