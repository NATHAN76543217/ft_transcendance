import CustomButton from '../utilities/CustomButton';
import { NavLink } from 'react-router-dom';
import { render } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import User from '../../pages/users/user';
import axios from 'axios';

type UserProps = {
    id?: number,        // optional ?
    name: string,
    status: string,
    nbWin?: number,
    nbLoss?: number,
    imgPath: string,
    twoFactorAuth?: boolean | false
    isMe?: boolean | false,
    isFriend?: boolean | false
    displayWinLose?: boolean | false
    handleClickTwoFactorAuth?: () => void
    handleClickProfilePicture?: () => void
    onFileChange?: (fileChangeEvent: any) => void
}

interface UserInformationStates {
    id?: number,
    twoFactorAuth?: boolean,
    imgPath: string
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
    if (user.displayWinLose) {
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
    let path = "https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg";

    if (user.imgPath !== null && user.imgPath != "") {
        path = "/api/" + user.imgPath;
    }
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
        {
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
}


// ------------------------------------------------------------------------------------
// NEED TO DELETE PROFILE PICTURE WHEN CHANGER ------------------------------------------
// ------------------------------------------------------------------------------------


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

                <div className="w-48 my-4 text-center">
                    {!user.isMe ?
                        (!user.isFriend ? <CustomButton
                            content="Add friend"
                            url="/user/friend"
                            bg_color="bg-secondary"
                            // bg_hover_color="bg-secondary-dark"
                            dark_text
                        /> :
                            <CustomButton
                                content="Remove friend"
                                url="/user/friend"
                                bg_color="bg-unset"
                                // bg_hover_color="bg-unset-dark"
                                dark_text
                            />
                        )
                        : null
                    }
                </div>
            </section>
            { user.isMe ?
                <section className="relative flex items-center justify-center">
                    <label className="font-bold text-gray-700">
                        <input className="mr-2 leading-tight" type="checkbox" onChange={user.handleClickTwoFactorAuth} checked={user.twoFactorAuth} />
                        <span className="text-sm">
                            Activate 2 factor authentication
                    </span>
                    </label>
                </section>
                : null
            }
        </div>
    );
}

export default UserInformation;