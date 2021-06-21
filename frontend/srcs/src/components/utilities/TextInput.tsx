// TODO: Hint

//import { ChangeEvent, useState } from "react";
import { Path, UseFormRegister } from "react-hook-form";

type TextInputProps<FormValues> = {
    label: Path<FormValues>;
    register: UseFormRegister<FormValues>;
    type: "text" | "password";
    required: boolean;
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

export function TextInput<FormValues>({label, register, type="text", required = false}: TextInputProps<FormValues>) {
    //const {value, bind, reset} = validateValue("");

    //const { register, handleSubmit, watch, formState: { errors } } = useForm();

    return (
        <div>
            <label
                className="first-letter:uppercase">
                {label}
            </label>
            <input
                type={type}
                className="w-4/5"
                {...register(label, { required })}
            />
        </div>
    );
}

TextInput.defaultProps = {
    type: "text",
    required: false,
}