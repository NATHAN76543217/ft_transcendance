import axios from "axios";
import { useForm } from "react-hook-form";

import React from "react";
import Cookies from 'js-cookie';


interface ILoginFormValues {
	username: string,
	password: string,
}
type ChildProps = {
	setUser: (user?: {}) => void
}

export default function Logout({setUser} : ChildProps) {
	const { handleSubmit } = useForm<ILoginFormValues>();

	const onSubmit = async () => {

		try {
			await axios.post("/api/authentication/logout", {withCredentials: true});
            console.log("Logout");//TODO to remove
		}
		catch (error) {
			if (axios.isAxiosError(error))
			{
                console.log("logout error ", error);
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
