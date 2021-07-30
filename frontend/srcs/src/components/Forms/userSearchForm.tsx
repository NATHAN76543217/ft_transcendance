import { TextInput } from "../utilities/TextInput";

import { useForm } from "react-hook-form";
import IUserSearchFormValues from "../../models/user/SearchUser.dto";

type UserSearchProps = {
  onSubmit: (values: IUserSearchFormValues) => void; // define function type
};

export default function SearchUser(props: UserSearchProps) {
  //const [username, password] = useState();

  const { register, handleSubmit } = useForm<IUserSearchFormValues>();

  return (
    <div className="h-auto max-w-sm pt-4 pl-4 mt-20 border-2 border-gray-300 rounded-sm bg-neutral">
      <h1 className="mb-2">
        <span className="ml-8 text-xl font-bold">Search users</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="">
        <div className="relative w-80">
          <TextInput
            name="username"
            register={register}
            labelClass="bloc"
            inputClass=" left"
            labelName="Username"
          ></TextInput>
          <div className="relative flex w-auto ">

          <input
            type="submit"
            value="search"
            className="absolute h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md right-8 bottom-8 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
            </div>
        </div>
      </form>
    </div>
  );
}
