import CustomButton from '../utilities/CustomButton';
import { NavLink } from 'react-router-dom';
import { UserRelationshipTypes } from './userRelationshipTypes';
import React from 'react';
import { TextInput } from '../utilities/TextInput';
import { useForm } from 'react-hook-form';
import ChangeNameUserForm from '../Forms/userChangeNameForm';
import IUserChangeNameFormValues from '../interface/IUserChangeNameFormValues';
import Popup from 'reactjs-popup';
import Alert from 'react-bootstrap/Alert'

type UserProps = {
    id: string,        // optional ?
    name: string,
    status: string,
    nbWin?: number,
    nbLoss?: number,
    imgPath: string,
    twoFactorAuth?: boolean | false
    isMe?: boolean | false,
    relationshipTypes: UserRelationshipTypes,
    idInf: boolean,
    isInSearch?: boolean | false,
    handleClickTwoFactorAuth?: () => void,
    handleClickProfilePicture?: () => void,
    onFileChange?: (fileChangeEvent: any) => void,
    addFriend: (id: string) => void,
    removeFriend: (id: string) => void,
    blockUser: (id: string) => void,
    unblockUser: (id: string) => void,
    changeUsername?: (values: IUserChangeNameFormValues) => void,
}

function getStatusColor(param: string) {
    switch (param) {
        case 'Connected':
            return ' text-green-600';
        case 'Offline':
            return ' text-red-600';
        case 'In game':
            return ' text-yellow-600';
        default:
            return '';
    }
}

function displayWinAndLose(user: UserProps) {
    if (user.isInSearch) {
        return (
            <div className="w-24 mx-2 text-center">
                <NavLink to={"/users/" + user.id} className="relative font-bold text-md">
                    Win / Lose
                        </NavLink>
                <h1 className={"relative font-bold text-md "}>
                    <span className="text-green-700">{user.nbWin}</span> / <span className="text-red-700">{user.nbLoss}</span>
                </h1>
            </div>
        )
    }
}


function displayProfilePicture(user: UserProps) {
    let path = (user.imgPath === "") ? "/api/uploads/default-profile-picture.png" : "/api/uploads/" + user.imgPath;
    return (
        <img className="object-contain w-32 h-full"
            src={path}
            alt="user profile"
            onClick={user.handleClickProfilePicture} />
    );
}

function onFileChangeTrigger(user: UserProps, ev: any) {
    if (user.onFileChange !== undefined) {
        return user.onFileChange(ev);
    } else {
        return;
    }
}

function displayFileChange(user: UserProps) {
    if (user.onFileChange !== undefined && user.isMe) {
        return (
            <div className="mt-1 align-center">
                <label className="custom-file-upload">
                    <input
                        type="file"
                        name="file"
                        className="hidden"
                        onChange={(ev) => onFileChangeTrigger(user, ev)} />
                    <i className="fa fa-cloud-upload" />
                    <span className="pl-1 ml-1 text-sm italic">Change picture</span>
                </label>
            </div>

        );
    }
}

function displayFriendButton(user: UserProps) {
    let isPending = user.idInf ?
        user.relationshipTypes & UserRelationshipTypes.pending_first_second :
        user.relationshipTypes & UserRelationshipTypes.pending_second_first;
    let isFriend = user.relationshipTypes & UserRelationshipTypes.pending_first_second &&
        user.relationshipTypes & UserRelationshipTypes.pending_second_first;
    let isAccept = user.idInf ?
        user.relationshipTypes & UserRelationshipTypes.pending_second_first :
        user.relationshipTypes & UserRelationshipTypes.pending_first_second;
    return (
        <div className="w-48 my-4 text-center">
            {!user.isMe ?
                (isFriend ?
                    <CustomButton
                        content="Remove friend"
                        // url="/users/unfriend"
                        onClickFunctionId={user.removeFriend}
                        argId={user.id}

                        bg_color="bg-unset"
                        // bg_hover_color="bg-unset-dark"
                        dark_text
                    />
                    : (isPending ?
                        <CustomButton
                            content="Pending request"
                            // url="/users/pending"
                            onClickFunctionId={user.removeFriend}
                            argId={user.id}

                            bg_color="bg-pending"
                            // bg_hover_color="bg-secondary-dark"
                            dark_text
                        />
                        : (isAccept
                            ?
                            <CustomButton
                                content="Accept friend request"
                                // url="/users/friend"
                                onClickFunctionId={user.addFriend}
                                argId={user.id}

                                bg_color="bg-accept"
                                // bg_hover_color="bg-secondary-dark"
                                dark_text
                            />
                            :
                            <CustomButton
                                content="Add friend"
                                // url="/users/friend"
                                onClickFunctionId={user.addFriend}
                                argId={user.id}

                                bg_color="bg-secondary"
                                // bg_hover_color="bg-secondary-dark"
                                dark_text
                            />
                        )
                    )
                )
                : null
            }
        </div>
    )
}

function displayBlockButton(user: UserProps) {
    let isBlock = user.idInf ?
        user.relationshipTypes & UserRelationshipTypes.block_first_second :
        user.relationshipTypes & UserRelationshipTypes.block_second_first

    return (
        <div className="w-48 my-4 text-center">
            {!user.isMe ?
                (!isBlock ? <CustomButton
                    content="Block user"
                    // url="/users/block"
                    onClickFunctionId={user.blockUser}
                    argId={user.id}
                    bg_color="bg-unset"
                    // bg_hover_color="bg-secondary-dark"
                    dark_text
                /> :
                    <CustomButton
                        content="Unblock user"
                        // url="/users/unblock"
                        onClickFunctionId={user.unblockUser}
                        argId={user.id}
                        bg_color="bg-secondary"
                        // bg_hover_color="bg-unset-dark"
                        dark_text
                    />
                )
                : null
            }
        </div>
    )
}

function displayTwoFactorAuth(user: UserProps) {
    return (
        user.isMe && !user.isInSearch ?
            <section className="relative flex items-center justify-center">
                <label className="font-bold text-gray-700">
                    <input className="mr-2 leading-tight" type="checkbox" onChange={user.handleClickTwoFactorAuth} checked={user.twoFactorAuth} />
                    <span className="text-sm">
                        Activate 2 factor authentication
                    </span>
                </label>
            </section>
            : null
    )
}


function DisplayChangeNameField(user: UserProps) {
    if (user.isMe && !user.isInSearch && user.changeUsername !== undefined) {
        return (
            <ChangeNameUserForm onSubmit={user.changeUsername} />
        )
    } else {
        return <div></div>
    }
}


function UserInformation(user: UserProps) {

    return (
        <div className="py-4 h-42">
            <section className="relative flex flex-wrap items-center justify-center py-2 my-2">
                <div className="relative w-32 mx-4">
                    {displayProfilePicture(user)}
                    {displayFileChange(user)}
                </div>

                <div className="w-40 mx-2 text-center">
                    <NavLink to={"/users/" + user.id} className="relative text-xl font-bold">
                        {user.name}
                    </NavLink>
                    <h1 className={"relative font-bold " + getStatusColor(user.status)}>
                        {user.status}
                    </h1>
                </div>


                {displayWinAndLose(user)}
                <div>
                    {displayFriendButton(user)}
                    {displayBlockButton(user)}
                </div>


            </section>
            {DisplayChangeNameField(user)}
            {displayTwoFactorAuth(user)}
        </div>
    );
}

export default UserInformation;