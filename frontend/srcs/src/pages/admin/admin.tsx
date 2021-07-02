import React from 'react';
import { UserRoleTypes } from '../../components/users/userRoleTypes';
import AdminChannels from './adminChannels';
import AdminUsers from './adminUsers';

class Admin extends React.Component {

    getRole() {
        return (UserRoleTypes.owner) // A CORRIGER AVEC LE VRAI ROLE
        // return (UserRoleTypes.admin)
        // return (UserRoleTypes.null)
    }

    render() {
        let myRole = this.getRole();
        if (myRole & (UserRoleTypes.owner + UserRoleTypes.admin)) {
            return (
                <div>
                    <AdminChannels

                    />
                    <AdminUsers
                        myRole={myRole}
                    />
                </div>
            )
        } else {
            return <div>You are not an administrator.</div>
        }
    }
}

export default Admin;