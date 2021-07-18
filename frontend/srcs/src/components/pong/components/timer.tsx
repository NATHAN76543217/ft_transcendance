import React from "react"

export function Timer({
    prefix
} : { prefix? : string} )
{
    const [value, setValue] = React.useState<number>(0);
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
