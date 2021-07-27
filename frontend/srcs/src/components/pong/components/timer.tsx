import React from "react"

type Setter = React.Dispatch<React.SetStateAction<number>>;

export function Timer({
    prefix,
    value,
    setValue
} : { value : number, setValue : Setter, prefix? : string }
){
    const prepended : string = prefix ? prefix : String();

    React.useEffect(() => {
        setTimeout(() => {
            setValue(value + 1);
        }, 1000);
    });

    return (
        <>
            {prepended + value}
        </>
    );
}
