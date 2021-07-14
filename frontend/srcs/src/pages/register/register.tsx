import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import axios from "axios";
import { useForm } from "react-hook-form";
interface IRegisterFormValues {
    username: string;
    password: string;
    'confirm password': string;
}

export default function Register(props: {}) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<IRegisterFormValues>();

    const onSubmit = async (values: IRegisterFormValues) => {
        if (values.password !== values["confirm password"])
            setError("confirm password", { message: "The password does not match." }, { shouldFocus: true });
        else {
            try {
                const data = await axios.post("/api/authentication/registerWithPassword", { name: values.username, password: values.password });
                console.log(data);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        const details = error.response.data as { statusCode: number, message: string };
                        setError("password", { message: details.message }, { shouldFocus: true });
                    }
                    else
                        setError("confirm password", { message: error.message }, { shouldFocus: false });
                }
                else {
                    setError("confirm password", { message: "Please try again later." }, { shouldFocus: false })
                }
            }
        }
    };

    return (
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 rounded-xl bg-neutral">
            <div className="mb-8">
                <h1 className='m-4 text-6xl text-center'>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput name="username" register={register} required={true} error={errors.username}></TextInput>
                    <TextInput name="password" register={register} type="password" required={true} error={errors.password}></TextInput>
                    <TextInput name="confirm password" register={register} type="password" required={true} error={errors["confirm password"]}></TextInput>
                    <input type='submit' value="Register" className={"rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary hover:bg-secondary-dark"}></input>
                </form>
            </div>
            {/* <div className="flex items-center">
            <Button
                content="Login with 42"
                url="https://localhost/api/authentication/oauth2/school42"
                className="bg-gray-400 whitespace-nowrap"
            />
            <Button
                content="Login with google"
                url="https://localhost/api/authentication/oauth2/google"
                className="bg-gray-400 whitespace-nowrap"
            />
            </div> */}
        </section>
    );
}
