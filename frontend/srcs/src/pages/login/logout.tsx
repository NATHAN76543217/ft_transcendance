import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import axios from "axios";
import { useForm } from "react-hook-form";

import React from "react";
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';


interface ILoginFormValues {
	username: string,
	password: string,
}
type ChildProps = {
	setUser: (user?: {}) => void
}

export default function Logout({setUser} : ChildProps) {

    console.log("setuser: ", setUser)
	const { handleSubmit, setError, formState: { errors } } = useForm<ILoginFormValues>();

	const onSubmit = async () => {

		try {
			const data = await axios.post("/api/authentication/logout", {withCredentials: true});
            console.log("Logout");
		}
		catch (error) {
			if (axios.isAxiosError(error))
			{
                console.log("logout error ", error)
            }
		}
        finally
        {
            setUser();
            Cookies.set("Authentication", "");
            localStorage.removeItem('user');
            window.location.href = '/';
            
        }
	};

	return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<input type='submit' value="Logout" className={"rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary"}></input>
			</form>
	);
}
