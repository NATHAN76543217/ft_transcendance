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
    primary ?: boolean | false,
    className ?: string
}

function Button({content, url, primary, className=""} : ButtonProps){
    return (
        <a className={ "inline-block rounded-xl text-neutral font-semibold p-4 mx-2  text-lg " + ( primary ? "bg-secondary " : "bg-neutral-dark " ) + className  } href={ url }>
            { content }
        </a>
    );
}

export default Button;