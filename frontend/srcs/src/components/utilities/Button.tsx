// type ButtonProps = {
//     content : string,
//     url?: string,
//     primary ?: boolean | false,
//     className ?: string,
//     onClick?: any
// }
// //TODO handle network disconected error
// function Button({content, url, primary, className="", onClick} : ButtonProps){
//     return (
//         <button type="button" onClick={onClick} className={ "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " + ( primary ? "bg-secondary " : "bg-neutral-dark " ) + className  } >
//             { content }
//         </button>
//     );
// }

// export default Button;
type ButtonProps = {
    content : string,
    url : string,
    secondary ?: boolean | false,
    className ?: string
}

function Button({content, url, secondary, className=""} : ButtonProps){
    const color = ( secondary ? " bg-secondary " : " bg-neutral " );
    const hoverColor = ( secondary ? "bg-secondary-dark " : "bg-neutral-dark " )
    return (
        // <a className={ "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " + color + " hover:" + hoverColor + className  } href={ url }>
        <a className={
                "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " +
                color +
                " hover:" + hoverColor + " " +
                className }
            href={ url }
        >
            { content }
        </a>
    );
}

export default Button;