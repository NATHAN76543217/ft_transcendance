import { TextInput } from "../../components/utilities/TextInput";

import { useForm } from "react-hook-form";
import ChannelCreateDto from "../../models/channel/CreateChannel.dto";
import { ChannelMode } from "../../models/channel/Channel";

type ChannelCreateProps = {
  onSubmit: (values: ChannelCreateDto) => void; // define function type
};

export default function ChannelCreateForm(props: ChannelCreateProps) {
  //const [username, password] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChannelCreateDto>();

  console.log(errors);

  return (
    <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
      <h1 className="mb-2">
        <span className="ml-8 text-xl font-bold">Create channel</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="py-4 pr-8">
        <div className="relative w-96">
          <TextInput
            name="name"
            register={register}
            labelClass="bloc"
            inputClass=" left"
          />
          {/* <TextInput
              name="mode"
              register={register}
              labelClass="bloc"
              inputClass=" left"
            /> */}
          <div className="mt-4">
            <span className="text-gray-700">Mode</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="radio" className="" value={`${ChannelMode.public}`} {...register("mode")}/>
                <span className="ml-2">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="" value={`${ChannelMode.protected}`} {...register("mode")} />
                <span className="ml-2">Protected</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="radio" className="" value={`${ChannelMode.private}`} {...register("mode")} />
                <span className="ml-2">Private</span>
              </label>
            </div>
          </div>


          <TextInput
            name="password"
            register={register}
            labelClass="bloc"
            inputClass=" left"
          />
          <input
            type="submit"
            value="create"
            className="absolute bottom-0 right-0 h-8 px-2 py-1 font-semibold bg-gray-200 rounded-md text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          ></input>
        </div>
      </form>
    </section>
  );
}
