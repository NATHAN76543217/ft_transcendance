import { Link } from "react-router-dom";
import { UserStatus } from "../../models/user/IUser";

type FriendsProps = {
    name: string,
    status: UserStatus,
    imgPath?: string,
    id?: number,
    canInvite?: boolean;
    canWatch?: boolean;
}

function FriendItem({ name, status, imgPath, id, canInvite, canWatch }: FriendsProps) {
    let path = (imgPath === "") ? "/api/uploads/default-profile-picture.png" : "/api/uploads/" + imgPath;
    let friendName = name.length < 10 ? name : name.substring(0, 10) + '...'
    let friendUrl = `/chat/${id}`

    const displayProfilePicture = () => {
        if (id) {
            return (
                <Link className="inline w-10 h-10 mx-4 my-auto " to={friendUrl}>
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
                    className='inline w-10 h-10 mx-4 my-auto rounded-full' />
            )
        }
    }

    const inviteFriendToPlay = () => {
        console.log('I want to play !')
    }

    // const acceptFriendInvitationToPlay = () => {

    // }

    // const watchFriendGame = () => {

    // }

    const displayInviteButton = () => {
        if (canInvite) {
            return (
                <button
                    className={
                        "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                        " bg-purple-300 hover:bg-purple-400" +
                        " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
                    }
                    // href={ url }
                    onClick={() => inviteFriendToPlay()}
                >
                    {'Invite to play'}
                </button>
            )
        }
    }

    const displayWatchButton = () => {
        if (canWatch) {
            return (
                <button
                    className={
                        "inline-block rounded-lg font-semibold py-1 mx-2 text-sm text-gray-900" +
                        " bg-yellow-300 hover:bg-yellow-400" +
                        " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
                    }
                    // href={ url }
                    onClick={() => inviteFriendToPlay()}
                >
                    {'Watch the game'}
                </button>
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
                {displayInviteButton()}
                {displayWatchButton()}
            </div>
        </li>
    );
}

export default FriendItem;