import { TextInput } from "../../components/utilities/TextInput";

import { useForm } from "react-hook-form";
import IChannelCreateFormValues from '../interface/IChannelCreateFormValues';

type ChannelCreateProps = {
    onSubmit: (values: IChannelCreateFormValues) => void  // define function type
}

export default function CreateChannel(props: ChannelCreateProps) {
    //const [username, password] = useState();

    const { register, handleSubmit, formState: { errors } } = useForm<IChannelCreateFormValues>();

    console.log(errors);

    return (
        <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
            <h1 className="mb-2">
                <span className="ml-8 text-xl font-bold">Create channel</span>
            </h1>
            <form onSubmit={handleSubmit(props.onSubmit)} className="py-4 pr-8">
            <div className="relative w-96">
                <TextInput name="name" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="password" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <TextInput name="mode" register={register} labelClass="bloc" inputClass=" left"></TextInput>
                <input type='submit' value="create" className="absolute bottom-0 right-0 h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"></input>
            </div>
            </form>
        </section>
    );
}

