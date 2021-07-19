import { TextInput } from "../../components/utilities/TextInput";
import Button from "../../components/utilities/Button";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
interface IRegisterFormValues {
    username: string;
    password: string;
    'confirm password': string;
}

export default function Register(props: {}) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<IRegisterFormValues>();

    const [registerInfo, setRegisterInfo] = useState({
        showRegisterValidation: false,
    })

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

    const onSubmit = async (values: IRegisterFormValues) => {
        setRegisterInfo({ showRegisterValidation: false })
        if (values.password !== values["confirm password"])
            setError("confirm password", { message: "The password does not match." }, { shouldFocus: true });
        else {
            try {
                const data = await axios.post("/api/authentication/registerWithPassword", { name: values.username, password: values.password });
                console.log(data);
                setRegisterInfo({ showRegisterValidation: true })
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

    function displayRegisterValidationMessage(showRegisterValidation: boolean) {

        if (showRegisterValidation) {
            return (
                <div className="absolute bottom-0 w-full font-bold text-center text-green-600">
                    Registration confirmed
                    <Button
                        content="Login"
                        secondary
                        url="/login"
                        className="w-24 ml-8 text-center"
                    />
                </div>
            );
        }
    }

    const displayShowPasswordButton = (show: boolean, setShow: any) => {
        return (
            <div
                className="absolute items-center justify-between cursor-pointer right-24 top-8"
                onClick={() => setShow(!show)}
            >
                <i className={"fas " + (show ? "fa-eye" : "fa-eye-slash")} />
            </div>
        )
    }

    return (
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 rounded-xl bg-neutral">
            <div className="relative ">
                <h1 className='m-4 text-6xl text-center'>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput name="username" register={register} required={true} error={errors.username} labelName="Username"></TextInput>
                    <div className="relative">
                        <TextInput name="password" register={register} type={showPassword ? "text" : "password"} required={true} error={errors.password} labelName="Password"></TextInput>
                        {displayShowPasswordButton(showPassword, setShowPassword)}
                    </div>
                    <div className="relative">
                        <TextInput name="confirm password" register={register} type={showPasswordConfirmation ? "text" : "password"} required={true} error={errors["confirm password"]} labelName="Confirm password"></TextInput>
                        {displayShowPasswordButton(showPasswordConfirmation, setShowPasswordConfirmation)}
                    </div>
                    <input type='submit' value="Register" className={"rounded-xl text-neutral font-semibold p-2 mt-4 mb-20 w-full text-lg bg-secondary hover:bg-secondary-dark"}></input>
                    {displayRegisterValidationMessage(registerInfo.showRegisterValidation)}
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
