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
        <section className="w-96 rounded-xl m-auto mt-32 p-4 bg-neutral">
            <h1 className='mt-2 text-6xl text-center'>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} method='POST' className="w-full flex flex-col">
                <TextInput name="username" register={register}></TextInput>
                <TextInput name="password" register={register} type="password"></TextInput>
                <button type='button' className={ "inline-block rounded-xl text-neutral font-semibold p-2 mt-4 text-lg bg-secondary"}>Login</button>
            </form>
        </section>
    );
}