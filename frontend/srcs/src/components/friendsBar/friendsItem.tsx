type FriendsProps = {
    name : string,
    status : string,
    imgPath?: string,
}

function FriendItem({name, status, imgPath} : FriendsProps)
{
    let path = (imgPath === "") ? "/api/uploads/default-profile-picture.png" : "/api/uploads/" + imgPath;
    return (
        <li className="flex h-16 border-t-2 border-gray-200">
            <img
                src={path}
                alt='friends_1_avatar'
                className='inline w-10 h-10 mx-4 my-auto bg-white rounded-full'/>
            <div className="inline-block my-auto align-middle">
                <span className="first-letter:uppercase">
                    { name }
                </span>
                <br/>
                <p className="block ml-4 text-xs text-neutral-dark">
                    something about
                </p>
            </div>
        </li>
    );
}

export default FriendItem;