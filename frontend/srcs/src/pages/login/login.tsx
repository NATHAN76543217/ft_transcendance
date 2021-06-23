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

    const { register, handleSubmit, formState: { errors } } = useForm<ILoginFormValues>();

    const onSubmit = async (values: ILoginFormValues) => {
        const data = await axios.post("localhost:8080/login", values);

        console.log(data);
    };

    return(
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 rounded-xl bg-neutral">
            <h1 className='m-4 text-6xl text-center'>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} method='POST'>
                <TextInput name="username" register={register} required={true} error={errors.username}></TextInput>
                <TextInput name="password" register={register} type="password" required={true} error={errors.password}></TextInput>
                <input type='submit' value="Login" className={"rounded-xl text-neutral font-semibold p-2 mt-4 w-full text-lg bg-secondary"}></input>
            </form>
        </section>
    );
}