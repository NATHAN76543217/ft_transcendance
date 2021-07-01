import axios from 'axios';
import React from 'react';
import { NavLink } from 'react-router-dom';
import IUserInterface from '../../components/interface/IUserInterface';
import User from '../../pages/users/user';
import { UserRoleTypes } from '../users/userRoleTypes';
import CustomButton from '../utilities/CustomButton';


type UserElementProps = {
    id: string,
    name: string,
    role: UserRoleTypes,
    myRole: UserRoleTypes,
    banUser: (id: string) => void,
    unbanUser: (id: string) => void,
    setAdmin: (id: string) => void,
    unsetAdmin: (id: string) => void,
    isChannelUserElement?: boolean | false,
}

function displayRole(role: UserRoleTypes) {

    // axios.patch("/api/users/1", { "role": 2 });

    const divClass = "italic text-sm ";
    switch (role) {
        case UserRoleTypes.owner:
            return <div className={divClass + "text-blue-600 font-semibold"}>Owner</div>;
        case UserRoleTypes.admin:
            return <div className={divClass + "text-green-600"}>Admin</div>;
        case UserRoleTypes.ban:
            return <div className={divClass + "text-red-600"}>Banned</div>;
        default:
            return <div className={divClass + "text-gray-700"}>standard</div>
    }
}

function isMyRoleAbove(user: UserElementProps) {
    let myRole = user.myRole;
    let role = user.role;
    if (user.isChannelUserElement) {
        return true;
    }
    if (myRole & UserRoleTypes.owner && !(role & UserRoleTypes.owner)) {
        return true;
    }
    if (myRole === UserRoleTypes.admin && role !== UserRoleTypes.owner && role !== UserRoleTypes.admin) {
        return true;
    }
    return false;
}

function displayBanButton(user: UserElementProps) {
    return (
        <div className="relative inline-block w-24 mt-2 mb-4 ml-8 text-center">
            {isMyRoleAbove(user) ?
                (!(user.role & UserRoleTypes.ban) ? <CustomButton
                    content="Ban user"
                    // url="/users/block"
                    onClickFunctionId={user.banUser}
                    argId={user.id}
                    bg_color="bg-unset"
                    // bg_hover_color="bg-secondary-dark"
                    dark_text
                    text_size="text-sm"
                /> :
                    <CustomButton
                        content="Unban user"
                        // url="/users/unblock"
                        onClickFunctionId={user.unbanUser}
                        argId={user.id}
                        bg_color="bg-secondary"
                        // bg_hover_color="bg-unset-dark"
                        dark_text
                        text_size="text-sm"
                    />
                )
                : <div />
            }
        </div>
    )
}

function displayAdminButton(user: UserElementProps) {
    if (!(user.role & UserRoleTypes.ban) && isMyRoleAbove(user)) {
        return (
            <div className="relative inline-block w-32 mt-2 mb-4 ml-8 text-center">
                {!(user.role & UserRoleTypes.owner) ?
                    (!(user.role & UserRoleTypes.admin) ? <CustomButton
                        content="Set admin"
                        // url="/users/block"
                        onClickFunctionId={user.setAdmin}
                        argId={user.id}
                        bg_color="bg-secondary"
                        // bg_hover_color="bg-secondary-dark"
                        dark_text
                        text_size="text-sm"
                    /> :
                        <CustomButton
                            content="Unset admin"
                            // url="/users/unblock"
                            onClickFunctionId={user.unsetAdmin}
                            argId={user.id}
                            bg_color="bg-unset"
                            // bg_hover_color="bg-unset-dark"
                            dark_text
                            text_size="text-sm"
                        />
                    )
                    : <div />
                }
            </div>
        )
    }
}

function AdminUserElement(user: UserElementProps) {

    return (
        <div className="items-center inline-block h-auto mt-2 group">
            <div className="flex">
                <div className="flex items-center justify-center w-24 mr-2">
                    {displayRole(user.role)}
                </div>
                <div className="w-48">
                    <NavLink to={"/users/" + user.id} className="font-bold text-md">
                        {user.name}
                    </NavLink>
                </div>
            </div>
            <div className={"hidden w-96 " + (!(user.role & UserRoleTypes.owner) ? "group-hover:block " : " ")}>
                {displayAdminButton(user)}
                {displayBanButton(user)}
            </div>
        </div>
        
    );
}

export default AdminUserElement;