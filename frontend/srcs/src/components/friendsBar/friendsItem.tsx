type FriendsProps = {
    name : string,
    status : string
}

function FriendItem({name, status } : FriendsProps)
{
    return (
        <li className="flex h-16" key={name}>
            <img
                src={ process.env.PUBLIC_URL + '/logo-menu.jpeg' }
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