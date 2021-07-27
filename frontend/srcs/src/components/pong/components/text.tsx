import React from "react"

type ITextProps = {
    content : string;
    divClassName : string;
    textClassName : string;
}

export default function Text({
    content,
    divClassName,
    textClassName
} : ITextProps)
{
    return (
        <div className={divClassName}>
            <text className={textClassName}>
                {content}
            </text>
        </div>
    );
}
