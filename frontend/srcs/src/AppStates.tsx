import IUserInterface from "./components/interface/IUserInterface";
import { UserRoleTypes } from "./components/users/userRoleTypes";
export interface AppStates {
	relationshipsList: IUserInterface[],
	myRole: UserRoleTypes,
	user: any,
	logged: boolean,
}
