type ButtonProps = {
    content : string,
    url : string,
    primary ?: boolean | false
}

function Button({content, url, primary} : ButtonProps){
    return (
        <a className={ "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " + ( primary ? "bg-secondary" : "bg-neutral-dark" ) } href={ url }>
            { content }
        </a>
    );
}

export default Button;