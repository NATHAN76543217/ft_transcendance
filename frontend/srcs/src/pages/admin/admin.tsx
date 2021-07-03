import React from 'react';
import AppContext from '../../AppContext';
import { UserRoleTypes } from '../../components/users/userRoleTypes';
import AdminChannels from './adminChannels';
import AdminUsers from './adminUsers';

class Admin extends React.Component {

    static contextType = AppContext;

    render() {
        const contextValue = this.context;
        if (contextValue.myRole & (UserRoleTypes.owner + UserRoleTypes.admin)) {
            return (
                <div>
                    <AdminChannels
                    />
                    <AdminUsers
                        myRole={contextValue.myRole}
                    />
                </div>
            )
        } else {
            return <div>You are not an administrator.</div>
        }
    }
}

export default Admin;