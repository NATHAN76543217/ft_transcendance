import React from "react";
import { Link } from "react-router-dom";
import { UserStatus } from "../../models/user/IUser";

type FriendsProps = {
    name: string,
    status: UserStatus,
    imgPath?: string,
    id?: number,
}

function FriendItem({ name, status, imgPath, id }: FriendsProps) {
    let path = (imgPath === "") ? "/api/uploads/default-profile-picture.png" : "/api/uploads/" + imgPath;
    let friendName = name.length < 10 ? name : name.substring(0, 10) + '...'
    let friendUrl = `/chat/${id}`

    const displayProfilePicture = () => {
        if (id) {
            return (
                <Link className="inline w-10 h-10 mx-4 my-auto bg-white " to={friendUrl}>
                    <img
                        src={path}
                        alt='friends_1_avatar'
                        className='rounded-full ' />
                </Link>
            )
        } else {
            return (
                <img
                    src={path}
                    alt='friends_1_avatar'
                    className='inline w-10 h-10 mx-4 my-auto bg-white rounded-full' />
            )
        }
    }
    return (
        <li className="flex h-16 border-t-2 border-gray-200">
            {displayProfilePicture()}
            <div className="inline-block my-auto align-middle">
                <span className="first-letter:uppercase">
                    {friendName}
                </span>
                <br />
                {/* <p className="block ml-4 text-xs text-neutral-dark">
                    something about
                </p> */}
            </div>
        </li>
    );
}

export default FriendItem;