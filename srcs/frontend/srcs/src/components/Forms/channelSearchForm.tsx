import { TextInput } from "../../components/utilities/TextInput";
import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import ChannelSearchDto from "../../models/channel/ChannelSearch.dto";

type ChannelSearchProps = {
  onSubmit: (values: ChannelSearchDto) => void; // define function type
};

export default function ChannelSearchForm(props: ChannelSearchProps) {
  // const [username, password] = useState();
  const { onSubmit } = props;
  const [once, setOnce] = useState(0);
  const { register, handleSubmit } = useForm<ChannelSearchDto>({ defaultValues: {channelName: ""}});
  
  React.useEffect(() => {
    // fetch list on channels on load
    if (once === 0)
    {
      onSubmit({channelName: ""});
      setOnce(1);
    }
    }, [onSubmit, once]);
  return (
    <div className="flex flex-col max-w-sm pt-4 mt-20 mb-2 border-2 border-gray-300 rounded-md bg-neutral">
      <h1 className="flex justify-center mb-2 ">
        <span className="text-2xl font-bold ">Search channels</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="">
        <div className="relative pl-4 w-96">
          <TextInput
            name="channelName"
            register={register}
            labelClass=""
            inputClass=" left"
            labelName="Channel name"
            placeholder="Enter a channel name..."
          ></TextInput>
          <input
            type="submit"
            value="search"
            className="absolute h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 right-12 bottom-8 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          ></input>
        </div>
      </form>
    </div>
  );
}
