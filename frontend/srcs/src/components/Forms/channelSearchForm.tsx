import { TextInput } from "../../components/utilities/TextInput";

import { useForm } from "react-hook-form";
import ChannelSearchDto from "../../models/channel/ChannelSearch.dto";

type ChannelSearchProps = {
  onSubmit: (values: ChannelSearchDto) => void; // define function type
};

export default function ChannelSearchForm(props: ChannelSearchProps) {
  //const [username, password] = useState();

  const { register, handleSubmit } = useForm<ChannelSearchDto>();

  return (
    <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
      <h1 className="mb-2">
        <span className="ml-8 text-xl font-bold">Search channels</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="py-4 pr-8">
        <div className="relative w-96">
          <TextInput
            name="channelName"
            register={register}
            labelClass=""
            inputClass=" left"
            labelName="Channel name"
            placeHolder="Enter a channel name..."
          ></TextInput>
          <input
            type="submit"
            value="search"
            className="absolute h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 right-12 bottom-8 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          ></input>
        </div>
      </form>
    </section>
  );
}
