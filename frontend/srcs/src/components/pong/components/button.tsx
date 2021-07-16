import React from "react"

type IButtonPongProps = {
    content : string;
    divClassName : string;
    buttonClassName : string;
    onClickHandler : React.MouseEventHandler<HTMLButtonElement>;
    disabled? : true;
}

export default function ButtonPong({
    content,
    divClassName,
    buttonClassName,
    onClickHandler,
    disabled
} : IButtonPongProps)
{
    return (
        <div className={divClassName}>
            <button className={buttonClassName} onClick={onClickHandler} disabled={disabled}>
                {content}
            </button>
        </div>
    );
}