import React from "react"

import ButtonPong from "./button"
import Text from "./text"
import {
    PongStyleSelectorContext
} from "../navigation/pages/gameCustom"

type IPongSelectorProps = {
    selectorClassName : string;
    buttonPrevDivClassName? : string;
    buttonPrevClassName? : string;
    buttonNextDivClassName? : string;
    buttonNextClassName? : string;
    textDivClassName? : string;
    textClassName? : string;
}

export default function PongStyleSelector({
    selectorClassName,
    buttonPrevDivClassName = String(),
    buttonPrevClassName = String(),
    buttonNextDivClassName = String(),
    buttonNextClassName = String(),
    textDivClassName = String(),
    textClassName = String()
} : IPongSelectorProps)
{
    const context = React.useContext(PongStyleSelectorContext);

    const onDecrement = () => {
        context.setPongIndex((context.pongIndex - 1) % context.pongSpetializations.length);
    }

    const onIncrement = () => {
        context.setPongIndex((context.pongIndex + 1) % context.pongSpetializations.length);
    }

    return (
        <div className={selectorClassName}>
            <ButtonPong
                content="Arrow Left"
                divClassName={buttonPrevDivClassName}
                buttonClassName={buttonPrevClassName}
                onClickHandler={onDecrement}
            />
            <PongStyleSelectorContext.Consumer>
            {
                value =>
                <Text
                    content={value.pongSpetializations[value.pongIndex][0]}
                    divClassName={textDivClassName}
                    textClassName={textClassName}
                />
            }
            </PongStyleSelectorContext.Consumer>
            <ButtonPong
                content="Arrow Right"
                divClassName={buttonNextDivClassName}
                buttonClassName={buttonNextClassName}
                onClickHandler={onIncrement}
            />
        </div>
    );
}
