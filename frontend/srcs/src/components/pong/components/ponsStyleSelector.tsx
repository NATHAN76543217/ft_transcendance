import React from "react"

import ButtonPong from "./button"
import Text from "./text"

import {
    IPongGame
} from "../navigation/pages/gameCustom"

interface ISelector
{
    data : IPongGame;
    pongStyles : Array<string>;
}

// export default class PongSlyleSelector extends React.Component
// {
//     public buttonPrevDivClassName : string = "";
//     public buttonPrevClassName : string = "";
//     public buttonNexDivClassName : string = "";
//     public buttonNextClassName : string = "";
//     public textDivClassName : string = "";
//     public textClassName : string = "";

//     constructor(
//         props : Readonly<{}>,
//         public selectorClassName : string,
//         public data : ISelector,
//         public updateGameConfig : Function,
//         buttonPrevDivClassName? : string,
//         buttonPrevClassName? : string,
//         buttonNexDivClassName? : string,
//         buttonNextClassName? : string,
//         textDivClassName? : string,
//         textClassName? : string
//     )
//     {
//         super(props);

//         this.onPrevPongStyle = this.onPrevPongStyle.bind(this);
//         this.onNextPongStyle = this.onNextPongStyle.bind(this);

//         if(buttonPrevDivClassName)
//             this.buttonPrevDivClassName = buttonPrevDivClassName;
//         if(buttonPrevClassName)
//             this.buttonPrevClassName = buttonPrevClassName;
//         if (buttonNexDivClassName)
//             this.buttonNexDivClassName = buttonNexDivClassName;
//         if (buttonNextClassName)
//             this.buttonNextClassName = buttonNextClassName;
//         if (textDivClassName)
//             this.textDivClassName = textDivClassName;
//         if (textClassName)
//             this.textClassName = textClassName;
//     }

//     private onNextPongStyle()
//     {
//         this.data.data.index = (this.data.data.index + 1) % this.data.pongStyles.length;
//         this.updateGameConfig();
//     }

//     private onPrevPongStyle()
//     { 
//         this.data.data.index = (this.data.data.index - 1) % this.data.pongStyles.length;
//         this.updateGameConfig();
//     }

//     public render()
//     {
//         return(
//             <div className={this.selectorClassName}>
//                 <ButtonPong content="Arrow Left" divClassName={this.buttonPrevDivClassName} buttonClassName={this.buttonPrevClassName} onClickHandler={this.onPrevPongStyle} />
//                 <Text content={this.data.pongStyles[this.data.data.index]} divClassName={this.textDivClassName} textClassName={this.textClassName} />
//                 <ButtonPong content="Arrow Right" divClassName={this.buttonPrevDivClassName} buttonClassName={this.buttonPrevClassName} onClickHandler={this.onNextPongStyle} />
//             </div>
//         );
//     }
// }

type IPongSelectorProps = {
    selectorClassName : string;
    data : ISelector;
    updateGameConfig : Function;
    buttonPrevDivClassName? : string;
    buttonPrevClassName? : string;
    buttonNextDivClassName? : string;
    buttonNextClassName? : string;
    textDivClassName? : string;
    textClassName? : string;
}

enum IndexAction
{
    INCREMENT,
    DECREMENT,
    RESET
}

// TO DO: Must be the context or copied back to the context
type IPongSelectorState = {
    index : number;
}

function init(value : number) : IPongSelectorState
{ return { index: value }; }

const len = 9; // TO DO: Use context for this

function reducer(state : IPongSelectorState, action : IndexAction)
{
    switch(action)
    {
        case IndexAction.DECREMENT:
            return {index: (state.index - 1) % len};
        case IndexAction.INCREMENT:
            return {index: (state.index + 1) % len};
        case IndexAction.RESET:
            return init(0);
        default:
            throw new Error(); // Unspected error
    }
}

// TO DO: Use context for : len, index & updateGameConfig
// TO DO: Context is for all data members too

export default function PongSlyleSelector({
    selectorClassName,
    data,
    updateGameConfig,
    buttonPrevDivClassName = String(),
    buttonPrevClassName = String(),
    buttonNextDivClassName = String(),
    buttonNextClassName = String(),
    textDivClassName = String(),
    textClassName = String()
} : IPongSelectorProps)
{
    const initialState : IPongSelectorState = init(0);
    const [state, dispatch] = React.useReducer(reducer, initialState.index, init);

    return (
        <div className={selectorClassName}>
            <ButtonPong
                content="Arrow Left"
                divClassName={buttonPrevDivClassName}
                buttonClassName={buttonPrevClassName}
                onClickHandler={() => { dispatch(IndexAction.DECREMENT); }}
            />
            <Text
                content={data.pongStyles[state.index]}
                divClassName={textDivClassName}
                textClassName={textClassName}
            />
            <ButtonPong
                content="Arrow Right"
                divClassName={buttonNextDivClassName}
                buttonClassName={buttonNextClassName}
                onClickHandler={() => { dispatch(IndexAction.INCREMENT); }}
            />
        </div>
    );
}
