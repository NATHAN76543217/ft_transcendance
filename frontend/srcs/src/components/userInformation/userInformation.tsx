import React from 'react';
import CustomButton from '../utilities/CustomButton';

type UserProps = {
    name: string,
    status: string,
    isMe?: boolean | false,
    isFriend?: boolean | false
}

function UserInformation(user: UserProps) {
    return (
        <div className="py-4 my-4 h-42">
            <section className="relative flex flex-wrap items-center justify-center py-2 my-2">
                <div className="relative w-32 mx-8">

                    <img className="object-contain w-32 h-full"
                        src="https://st.depositphotos.com/2101611/3925/v/950/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
                        alt="user profile" />
                </div>
                <div className="mx-8">
                    <h1 className="relative text-xl font-bold">
                        {user.name}
                    </h1>
                    <h1 className="relative font-bold text-green-600">
                        {user.status}
                    </h1>
                </div>
                <div className="my-4">
                    {!user.isMe ?
                        (user.isFriend ? <CustomButton
                            content="Add friend"
                            url="/user/friend"
                            color="secondary"
                            dark_text
                        /> :
                            <CustomButton
                                content="Remove friend"
                                url="/user/friend"
                                color="unset"
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
                        <input className="mr-2 leading-tight" type="checkbox" />
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