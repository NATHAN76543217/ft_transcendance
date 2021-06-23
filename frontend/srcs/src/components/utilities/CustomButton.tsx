type CustomButtonProps = {
    content : string,
    url : string,
    color : string,
    dark_text?: boolean | false
}

function CustomButton({content, url, color, dark_text} : CustomButtonProps){
    return (
        <a className={ "inline-block rounded-lg font-semibold px-2 py-1 mx-2 text-lg bg-" + color + " hover:bg-" + color + "-dark " + ( dark_text ? "text-gray-900" : "text-neutral" ) } href={ url }>
            { content }
        </a>
    );
}

export default CustomButton;