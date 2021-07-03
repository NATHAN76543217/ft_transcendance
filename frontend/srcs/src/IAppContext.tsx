import IUserInterface from "./components/interface/IUserInterface";
import { UserRoleTypes } from "./components/users/userRoleTypes";

export interface IAppContext {
	relationshipsList: IUserInterface[],
	myId: string,
	myRole: UserRoleTypes,
	updateAllRelationships: () => void
}


