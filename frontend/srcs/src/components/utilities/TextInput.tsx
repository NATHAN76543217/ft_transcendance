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

    return (
        <div>
            <label htmlFor={name} className={`capitalize ${labelClass}`}>{name}</label>
            <input type={type} id={name} placeholder={`Enter ${name}`} className={`w-full ${inputClass}`} {...register(name, { required })}/>
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