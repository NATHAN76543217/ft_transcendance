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
}

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

export {}

export function TextInputError(error?: FieldError) {
    let message: string = "";

    if (error)
    {
        if (error.message)
            message = error.message;
        else if (error.type === "required")
            message = "This field is required";
    }
    return (<span>{message}</span>)
}

export function TextInput<FormValues>({name, register, type, required, labelClass, inputClass, error}: TextInputProps<FormValues>) {
    //const {value, bind, reset} = validateValue("");

    //const { register, handleSubmit, watch, formState: { errors } } = useForm();
    let labelBasicClassName = "mb-2 ml-8 text-lg font-bold"
    let inputBasicClassName = "flex h-auto px-2 py-1 mx-2 mb-2 font-semibold bg-gray-200 rounded-sm text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none w-3/4"

    return (
        <div className="">
            <label htmlFor={name} className={`${labelBasicClassName} capitalize ${labelClass}`}>{name}</label>
            <input type={type} id={name} placeholder={`Enter ${name}`} className={`${inputBasicClassName} ${inputClass}`} {...register(name, { required })}/>
            {TextInputError(error)}
        </div>
    );
}

TextInput.defaultProps = {
    type: "text",
    required: false,
    labelClass: "",
    inputClass: ""
}