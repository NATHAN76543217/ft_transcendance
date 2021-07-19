import { TextInput } from "../../components/utilities/TextInput";

import { DeepMap, FieldError, useForm } from "react-hook-form";
import ChannelCreateDto from "../../models/channel/CreateChannel.dto";
import { ChannelMode } from "../../models/channel/Channel";
import { useState } from "react";

interface ICreateChannelFormValues {
  channelName: string;
  mode: ChannelMode;
  password?: string;
}

type ChannelCreateProps = {
  onSubmit: (values: ChannelCreateDto) => void; // define function type
  errors: any
};


export default function ChannelCreateForm(props: ChannelCreateProps) {
  // const [showPassword, setShowPassword] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<ChannelCreateDto>();


  const TextInputError = (error?: FieldError) => {
    let message: string = "";

    if (error) {
        if (error.message)
            message = error.message;
        else if (error.type === "required")
            message = "This field is required";
    }
    return (<span className="inline-block ml-2 font-semibold text-red-500">{message}</span>)
}

  console.log("channelcreateelement errors: ",props.errors);

  let radioLabelClassName = "inline-flex items-center ml-2 mr-2"
  let radioInputClassName = ""
  let radioSpanClassName = "ml-1 font-semibold"

  return (
    <section className="flex flex-col max-w-sm p-4 m-auto mt-32 bg-neutral">
      <h1 className="mb-2">
        <span className="ml-8 text-xl font-bold">Create channel</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="py-2 pr-8">
        <div className="relative w-96">
          <TextInput
            name="name"
            register={register}
            labelClass=""
            inputClass=" left"
            labelName="Name"
            error={props.errors.channelName}
          />

          <div className="h-16 mb-4">
            <span className="mb-2 ml-2 text-lg font-bold ">Mode</span>
            <div className="relative ">
              <label className={radioLabelClassName}>
                <input type="radio" className={radioInputClassName} value={`${ChannelMode.public}`} {...register("mode")} />
                <span className={radioSpanClassName}>Public</span>
              </label>
              <label className={radioLabelClassName + ""}>
                <input type="radio" className={radioInputClassName} value={`${ChannelMode.private}`} {...register("mode")} />
                <span className={radioSpanClassName}>Private</span>
              </label>
              <label className={radioLabelClassName}>
                <input type="radio" className={radioInputClassName} value={`${ChannelMode.protected}`} {...register("mode")} />
                <span className={radioSpanClassName}>Protected</span>
              </label>
              {TextInputError(props.errors.mode)}
            </div>
          </div>

            <TextInput
              name="password"
              register={register}
              labelClass=" "
              inputClass=" left"
              labelName="Password (for protected channel)"
              error={props.errors.password}
            />



          <div className="relative w-3/4 text-center">
            <input
              type="submit"
              value="Create channel"
              className="relative h-8 px-4 py-1 mt-4 font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
          </div>
        </div>
      </form>
    </section>
  );
}
