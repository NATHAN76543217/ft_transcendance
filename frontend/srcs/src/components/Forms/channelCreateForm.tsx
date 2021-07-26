import { TextInput } from "../../components/utilities/TextInput";

import { FieldError, useForm } from "react-hook-form";
import ChannelCreateDto from "../../models/channel/CreateChannel.dto";
import { ChannelMode } from "../../models/channel/Channel";
import { useState } from "react";


type ChannelCreateProps = {
  onSubmit: (values: ChannelCreateDto) => void; // define function type
  errors: any;
  showCreationValidation: boolean;
};


export default function ChannelCreateForm(props: ChannelCreateProps) {
  // const [showPassword, setShowPassword] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<ChannelCreateDto>();


  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

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


  const displayCreationValidationMessage = (showRegisterValidation: boolean) => {
    if (showRegisterValidation) {
      return (
        <div className="absolute bottom-0 w-full pr-12 font-bold text-center text-green-600">
          Channel creation confirmed
        </div>
      );
    }
  }

  const displayShowPasswordButton = (show: boolean, setShow: any) => {
    return (
      <div
        className="absolute items-center justify-between cursor-pointer right-20 top-8"
        onClick={() =>
          setShow(!show)
        }
      >
        <i
          className={
            "fas " +
            (show
              ? "fa-eye"
              : "fa-eye-slash")
          }
        />
      </div>
    )
  }

  let radioLabelClassName = "inline-flex items-center ml-2 mr-2"
  let radioInputClassName = ""
  let radioSpanClassName = "ml-1 font-semibold"

  return (
    <div className="flex flex-col max-w-sm pt-4 mt-20 mb-2 rounded-md bg-neutral w-80">
      <h1 className="flex justify-center mb-2 ">
        <span className="text-2xl font-bold">Create channel</span>
      </h1>
      <form onSubmit={handleSubmit(props.onSubmit)} className="py-2">
        <div className="relative pl-4 w-80">
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

          <div className="relative">
            <TextInput
              name="password"
              register={register}
              type={showPassword ? "text" : "password"}
              inputClass=" left"
              labelName="Password"
              error={props.errors.password}
            />
            {displayShowPasswordButton(showPassword, setShowPassword)}
          </div>

          <div className="relative">
            <TextInput
              name="passwordConfirmation"
              register={register}
              type={showPasswordConfirmation ? "text" : "password"}
              inputClass=" left"
              labelName="Confirm password"
              placeHolder="Enter password again"
              error={props.errors.passwordConfirmation}
            />
            {displayShowPasswordButton(showPasswordConfirmation, setShowPasswordConfirmation)}
          </div>

          <div className="flex justify-center pr-4 ">
            <input
              type="submit"
              value="Create channel"
              className="h-10 px-4 py-1 mt-4 mb-8 text-lg font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
          </div>
          {displayCreationValidationMessage(props.showCreationValidation)}
        </div>
      </form>
    </div>
  );
}
