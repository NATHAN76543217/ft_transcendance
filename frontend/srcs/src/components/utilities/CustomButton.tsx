type CustomButtonProps = {
    content : string,
    url ?: string,
    onClickFunctionId: (id:string) => void,
    argId: string;
    bg_color : string,
    bg_hover_color?: string | undefined,
    dark_text?: boolean | false
}

function CustomButton({content, url, onClickFunctionId, argId, bg_color, bg_hover_color, dark_text} : CustomButtonProps){
    if (bg_hover_color === undefined) {
        bg_hover_color = bg_color + "-dark";
    }

    return (
        <a className={ "inline-block rounded-lg font-semibold px-2 py-1 mx-2 text-lg " + ( dark_text ? " text-gray-900 " : " text-neutral " ) + bg_color +  " hover:" + bg_hover_color + " focus:outline-none focus:ring-2 focus:ring-gray-500"  }
            // href={ url }
            onClick={() => onClickFunctionId(argId)}    
        >
            { content }
        </a>
    );
}

export default CustomButton;