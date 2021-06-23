import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

// import Button from '../../components/utilities/Button';
import UserInformation from '../../components/userInformation/userInformation';

type UserProps = {
    id?: number,
    isMe?: boolean | false
}

interface ILoginFormValues {
    username: string
}


function UserSearch (props: UserProps) {
    // constructor(props) 
    // {
    //     super(props);
    //     this.props.isMe = false;
    // }

    // const isMe: boolean;
    const { register, handleSubmit } = useForm<ILoginFormValues>();

    const onSubmit = (values: ILoginFormValues) => {
    axios.get("localhost:8080/users/" + values.username); // use values to use name in search
    }


        return (
            <div className="">
                <form onSubmit={handleSubmit(onSubmit)} method='GET' className="py-4 pr-8 bg-white">
                    <label className="bloc" htmlFor="username">
                        <h1 className="mb-2">
                            <span className="ml-8 text-lg font-bold">Search users</span>
                        </h1>
                        <div className="flex items-center object-center">
                            <input
                                className="w-64 py-1 pl-2 mx-4 bg-gray-200 rounded-sm focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
                                type="text"
                                placeholder="Enter a username..."
                                id="username"
                            />
                            <button className="h-auto px-2 py-1 font-semibold bg-gray-200 rounded-md text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none">Search</button>
                        </div>
                    </label>
                </form>
                <ul>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login"
                            status="Connected"
                            isFriend
                        />
                    </li>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login2"
                            status="Offline"
                        />
                    </li>
                    <li className="relative w-full">
                        <UserInformation
                            name="Login3"
                            status="In game"
                            isFriend
                        />
                    </li>
                </ul>
            </div>
        );
}

export default UserSearch;