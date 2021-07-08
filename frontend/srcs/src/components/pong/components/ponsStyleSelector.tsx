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

export default class PongSlyleSelector extends React.Component
{
    public buttonPrevDivClassName : string = "";
    public buttonPrevClassName : string = "";
    public buttonNexDivClassName : string = "";
    public buttonNextClassName : string = "";
    public textDivClassName : string = "";
    public textClassName : string = "";

    constructor(
        props : Readonly<{}>,
        public selectorClassName : string,
        public data : ISelector,
        public updateGameConfig : Function,
        buttonPrevDivClassName? : string,
        buttonPrevClassName? : string,
        buttonNexDivClassName? : string,
        buttonNextClassName? : string,
        textDivClassName? : string,
        textClassName? : string
    )
    {
        super(props);

        this.onPrevPongStyle = this.onPrevPongStyle.bind(this);
        this.onNextPongStyle = this.onNextPongStyle.bind(this);

        if(buttonPrevDivClassName)
            this.buttonPrevDivClassName = buttonPrevDivClassName;
        if(buttonPrevClassName)
            this.buttonPrevClassName = buttonPrevClassName;
        if (buttonNexDivClassName)
            this.buttonNexDivClassName = buttonNexDivClassName;
        if (buttonNextClassName)
            this.buttonNextClassName = buttonNextClassName;
        if (textDivClassName)
            this.textDivClassName = textDivClassName;
        if (textClassName)
            this.textClassName = textClassName;
    }

    private onNextPongStyle()
    {
        this.data.data.index = (this.data.data.index + 1) % this.data.pongStyles.length;
        this.updateGameConfig();
    }

    private onPrevPongStyle()
    { 
        this.data.data.index = (this.data.data.index - 1) % this.data.pongStyles.length;
        this.updateGameConfig();
    }

    public render()
    {
        return(
            <div className={this.selectorClassName}>
                {
                    new ButtonPong(
                        this.props,
                        "Arrow Left",
                        this.buttonPrevDivClassName,
                        this.buttonPrevClassName,
                        this.onPrevPongStyle
                    )
                }
                {
                    new Text(
                        this.props,
                        this.data.pongStyles[this.data.data.index],
                        this.textDivClassName,
                        this.textClassName
                    )
                }
                {
                    new ButtonPong(
                        this.props,
                        "Arrow Right",
                        this.buttonNexDivClassName,
                        this.buttonNextClassName,
                        this.onNextPongStyle
                    )
                }
            </div>
        );
    }
}
