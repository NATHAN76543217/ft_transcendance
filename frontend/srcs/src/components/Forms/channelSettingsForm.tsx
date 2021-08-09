import { TextInput } from "../../components/utilities/TextInput";

import { FieldError, useForm } from "react-hook-form";
import ChannelCreateDto from "../../models/channel/CreateChannel.dto";
import { ChannelMode } from "../../models/channel/Channel";
import { useEffect, useState } from "react";

type ChannelCreateProps = {
  onSubmit: (values: ChannelCreateDto) => void; // define function type
  errors: any;
  showUpdateValidation: boolean;
  mode: ChannelMode;
};

export default function ChannelSettingsForm(props: ChannelCreateProps) {
  // const [showPassword, setShowPassword] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<ChannelCreateDto>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<ChannelMode | null>(null);

  useEffect(() => {
    setSelectedMode(props.mode);
  }, [props.mode]);

  const TextInputError = (error?: FieldError) => {
    let message: string = "";

    if (error) {
      if (error.message) message = error.message;
      else if (error.type === "required") message = "This field is required";
    }
    return (
      <span className="inline-block ml-2 font-semibold text-red-500">
        {message}
      </span>
    );
  };

  const displayUpdateValidationMessage = (showRegisterValidation: boolean) => {
    if (showRegisterValidation) {
      return (
        <div className="w-full pr-12 mt-2 font-bold text-center text-green-600 ">
          Channel update confirmed
        </div>
      );
    }
  };

  const displayShowPasswordButton = (show: boolean, setShow: any) => {
    return (
      <div
        className="absolute items-center justify-between cursor-pointer right-28 top-8"
        onClick={() => setShow(!show)}
      >
        <i className={"fas " + (show ? "fa-eye" : "fa-eye-slash")} />
      </div>
    );
  };

  let radioLabelClassName = "inline-flex items-center ml-2 mr-2";
  let radioInputClassName = "";
  let radioSpanClassName = "ml-1 font-semibold";

  const onChangeRadio = (e: any) => {
    setSelectedMode(e.target.value);
    // console.log("selectedMode", selectedMode);
  };

  const modeList = [
    {
      name: "Public",
      mode: ChannelMode.public,
    },
    {
      name: "Private",
      mode: ChannelMode.private,
    },
    {
      name: "Protected",
      mode: ChannelMode.protected,
    },
  ];

  return (
    <section className="flex flex-col justify-center max-w-sm pt-2 border-t-2 border-gray-400 w-80">
      <form onSubmit={handleSubmit(props.onSubmit)} className="py-2">
        <div className=" w-96">
          <div className="h-16 mb-4">
            <span className="mb-2 ml-2 text-lg font-bold ">Mode</span>
            <div className="">
              {modeList.map((elem) => {
                return (
                  <label className={radioLabelClassName} key={elem.name}>
                    <input
                      checked={Number(selectedMode) === elem.mode}
                      // defaultChecked={Number(props.mode) === elem.mode}
                      onClick={onChangeRadio}
                      type="radio"
                      className={radioInputClassName}
                      value={elem.mode}
                      {...register("mode")}
                    />
                    <span className={radioSpanClassName}>{elem.name}</span>
                  </label>
                );
              })}
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
              placeholder="Enter password again"
              error={props.errors.passwordConfirmation}
            />
            {displayShowPasswordButton(
              showPasswordConfirmation,
              setShowPasswordConfirmation
            )}
          </div>

          <div className="w-3/4 text-center ">
            <input
              type="submit"
              value="Update channel properties"
              className="h-8 px-4 py-1 mt-4 font-semibold bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
            ></input>
          </div>
          {displayUpdateValidationMessage(props.showUpdateValidation)}
        </div>
      </form>
    </section>
  );
}
