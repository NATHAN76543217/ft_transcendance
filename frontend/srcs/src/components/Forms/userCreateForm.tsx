import { TextInput } from "../../components/utilities/TextInput";

import { useForm } from "react-hook-form";
import IUserCreateFormValues from '../interface/IUserCreateFormValues';


type UserCreateProps = {
    onSubmit: (values: IUserCreateFormValues) => void  // define function type
}

export default function SearchUser(props: UserCreateProps) {
    //const [username, password] = useState();

    const { register, handleSubmit, formState: { errors } } = useForm<IUserCreateFormValues>();

    return (
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
            <h1 className="mb-2">
                <span className="ml-8 text-xl font-bold">Create user</span>
            </h1>
            <form onSubmit={handleSubmit(props.onSubmit)} className="py-4 pr-8">
            <div className="relative w-96">
                <TextInput name="name" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="status" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="nbWin" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="nbLoss" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="imgPath" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <input type='submit' value="create" className="absolute bottom-0 right-0 h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"></input>
            </div>
            </form>
        </section>
    );
}

