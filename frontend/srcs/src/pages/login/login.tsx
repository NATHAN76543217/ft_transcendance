import { useEffect } from "react";
import { TextInput } from "../../components/utilities/TextInput";

import axios from "axios";
import { useForm } from "react-hook-form";
interface ILoginFormValues {
    username: string,
    password: string,
}

export function Login(props: {})
{
    //const [username, password] = useState();

    const { register, handleSubmit } = useForm<ILoginFormValues>();

    const onSubmit = (values: ILoginFormValues) => {
        axios.post("localhost:8080/login", values);
    };

    return(
        <div className="w-1/2 m-auto bg-neutral">
            <section className='w-64'>
                <h1 className='block mt-40 ml-40 text-6xl text-center'>
                    Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} method='POST' className="w-full">
                    <TextInput label="username" register={register}></TextInput>
                    <TextInput label="password" register={register} type="password"></TextInput>
                    <button type='submit' title='Login'/> 
                </form>
            </section>
        </div>
    );
}