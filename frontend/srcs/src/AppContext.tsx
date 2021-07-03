import React from 'react'
import { UserRoleTypes } from './components/users/userRoleTypes'
import { IAppContext } from './IAppContext'

const AppContext = React.createContext<IAppContext>({
	relationshipsList: [],
	myId: "",
	myRole: UserRoleTypes.null,
	updateAllRelationships: () => {}
})

export const AppProvider = AppContext.Provider
export const AppConsumer = AppContext.Consumer

export default AppContext