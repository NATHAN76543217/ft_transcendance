type ButtonProps = {
    content : string,
    url?: string,
    primary ?: boolean | false,
    className ?: string,
    onClick?: any
}

function Button({content, url, primary, className="", onClick} : ButtonProps){
    return (
        <button type="button" onClick={onClick} className={ "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " + ( primary ? "bg-secondary " : "bg-neutral-dark " ) + className  } >
            { content }
        </button>
    );
}

export default Button;