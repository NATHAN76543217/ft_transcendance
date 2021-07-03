import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import axios from "axios";
import { useForm } from "react-hook-form";

interface ILoginFormValues {
	username: string,
	password: string,
}

export default function Login(props: {}) {

    const { register, handleSubmit, setError, formState: { errors } } = useForm<ILoginFormValues>();
	const onSubmit = async (values: ILoginFormValues) => {
		try {
			const data = await axios.post("/api/authentication/login", { name: values.username, password: values.password });
			console.log(data);
		}
		catch (error) {
			if (axios.isAxiosError(error))
			{
				if (error.response?.status === 400)
				{
					const details = error.response.data as {statusCode: number, message: string};
					setError("password" , {message: details.message}, {shouldFocus: true});
				}
				else
					setError("password" , {message: error.message}, {shouldFocus: true});
			}
			else
			{
				setError("password", {message: "Please try again later."}, {shouldFocus: false})
			}
		}

	};

	return (
		<section className="flex flex-col max-w-sm p-4 m-auto mt-32 rounded-xl bg-neutral">
			<h1 className='m-4 text-6xl text-center'>Login</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextInput name="username" register={register} required={true} error={errors.username}></TextInput>
				<TextInput name="password" register={register} type="password" required={true} error={errors.password}></TextInput>
				<input type='submit' value="Login" className={"rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary"}></input>
			</form>
			{/* <button type="button" onClick={() => {
				const newTab = window.open("https://localhost/api/authentication/oauth2/school42");
				}}>
				content="Login with 42"
			</button> */}
			{/* TODO up: button with new tab    bellow: button on the same tab */}
			<Button
				content="Login with 42"
				url="https://localhost/api/authentication/oauth2/school42"
				className=""
				/>
			<Button
				content="Login with google"
				url="https://localhost/api/authentication/oauth2/google"
				className=""
				/>
		</section>
	);
}
