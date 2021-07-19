import React from "react";

type CustomButtonProps = {
  content: string;
  url?: string;
  onClickFunctionId?: (id: number) => void;
  argId: number;
  bg_color: string;
  bg_hover_color?: string | undefined;
  dark_text?: boolean | false;
  text_size?: string;
};

function CustomButton({
  content,
  url,
  onClickFunctionId,
  argId,
  bg_color,
  bg_hover_color,
  dark_text,
  text_size,
}: CustomButtonProps) {
  if (bg_hover_color === undefined) {
    bg_hover_color = bg_color + "-dark";
  }

  const localOnClickFunctionId = (argId: number) => {
    if (onClickFunctionId !== undefined) {
      onClickFunctionId(argId)
    } else {
      return ;
    }
  }

  // bg_hover_color = "bg-gray-500"

  return (
    <button
      className={
        "inline-block rounded-lg font-semibold py-1 mx-2 " +
        (text_size === undefined ? "text-lg" : text_size) +
        (dark_text ? " text-gray-900 " : " text-neutral ") +
        bg_color +
        " hover:" +
        bg_hover_color + " " +
        " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto px-2"
      }
      // href={ url }
      onClick={() => localOnClickFunctionId(argId)}
    >
      {content}
    </button>
  );
}

export default CustomButton;
