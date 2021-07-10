import { useForm } from "react-hook-form";
import IUserChangeNameFormValues from "../interface/IUserChangeNameFormValues";



type UserChangeNameSearchProps = {
    onSubmit: (values: IUserChangeNameFormValues) => void  // define function type
}

export default function ChangeNameUser(props: UserChangeNameSearchProps) {
    //const [username, password] = useState();

    const { register, handleSubmit } = useForm<IUserChangeNameFormValues>();

    return (

        <form onSubmit={handleSubmit(props.onSubmit)} className="flex items-center justify-center py-4 pr-8">
            <div className="relative w-64 ">
                <input type="text" id="username"
                    placeholder="Enter new username"
                    className="w-40 h-auto px-2 py-1 mx-2 mb-2 text-sm font-semibold bg-gray-200 rounded-sm bloc focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
                    {...register('username')} />
                <input type='submit' value="submit"
                    className="absolute right-0 h-auto px-2 py-1 text-sm font-semibold bg-gray-200 rounded-md bloc focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none" />
            </div>
            {/* <Alert color="primary">
                Username is wrong or already taken
            </Alert> */}
        </form>

    );
}

