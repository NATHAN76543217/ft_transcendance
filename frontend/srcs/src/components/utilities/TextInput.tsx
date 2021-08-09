// TODO: Hint

//import { ChangeEvent, useState } from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";

type TextInputProps<FormValues> = {
  name: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  type: "text" | "password";
  required: boolean;
  labelClass: string;
  inputClass: string;
  error?: FieldError;
  placeholder?: string;
  labelName?: string;
  noLabel: boolean;
  noError: boolean;
};

/* const validateValue = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);

    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                setValue(event.target.value);
            }
        }
    };
} */

type TextInputErrorProps = {
  error?: FieldError;
};

export function TextInputError({ error }: TextInputErrorProps) {
  let message: string = "\u200b";

  if (error !== undefined) {
    if (error.message) message = error.message;
    else if (error.type === "required") message = "This field is required";
  }
  return <span className="ml-2 font-semibold text-red-500">{message}</span>;
}

export function TextInput<FormValues>({
  name,
  register,
  type,
  required,
  labelClass,
  inputClass,
  error,
  placeholder,
  labelName,
  noLabel,
  noError,
}: TextInputProps<FormValues>) {
  //const {value, bind, reset} = validateValue("");

  //const { register, handleSubmit, watch, formState: { errors } } = useForm();
  let labelBasicClassName = "mb-2 ml-2 text-lg font-bold";
  let inputBasicClassName =
    "flex px-2 py-1 mx-2 font-semibold bg-gray-200 rounded-sm text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none w-3/5";

  // Default label
  if (labelName === undefined) {
    labelName = name;
  } else if (labelName.length === 0) {
    noLabel = true;
  }

  if (!noLabel) {
    inputBasicClassName += " mb-2";
    // Default placeholder
    if (placeholder === undefined) {
      placeholder = `Enter ${labelName}`;
    }
  }

  return (
    <>
      {!noLabel && (
        <label
          htmlFor={name}
          className={`${labelBasicClassName}  ${labelClass}`}
        >
          {labelName}
        </label>
      )}
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        autoComplete="off"
        className={`${inputBasicClassName} ${inputClass}`}
        {...register(name, { required })}
      />
      {!noError && <TextInputError error={error} />}
    </>
  );
}

TextInput.defaultProps = {
  type: "text",
  required: false,
  labelClass: "",
  inputClass: "",
  noLabel: false,
  noError: false,
};
