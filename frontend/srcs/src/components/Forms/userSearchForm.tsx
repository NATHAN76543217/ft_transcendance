import { TextInput } from "../../components/utilities/TextInput";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import IUserSearchFormValues from './IUserSearchFormValues';


type UserSearchProps = {
    onSubmit: (values: IUserSearchFormValues) => void  // define function type
}

export default function SearchUser(props: UserSearchProps) {
    //const [username, password] = useState();

    const { register, handleSubmit, formState: { errors } } = useForm<IUserSearchFormValues>();
    
    const [list, setList] = useState('begin');

    // const onSubmit = async (values: IUserSearchFormValues) => {

    //     // const data = await axios.get("localhost:8080/users");

    //     // console.log(values.username);
    //     console.log(list);
    //     await setList('end');
    //     console.log('The list value is ' + list + '!!!');
    //     // console.log(data);
    // };

    return (
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
            <h1 className="mb-2">
                <span className="ml-8 text-xl font-bold">Search users</span>
            </h1>
            <form onSubmit={handleSubmit(props.onSubmit)} className="py-4 pr-8">
            <div className="flex items-center object-center">
                <TextInput name="username" register={register} labelClass="bloc" inputClass=""></TextInput>
                <input type='submit' value="search" className="h-auto px-2 py-1 font-semibold bg-gray-200 rounded-md text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"></input>
                </div>
            </form>
        </section>
    );
}


{/* <div className="">
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
            </div> */}