
import React from "react"

export default class ButtonPong extends React.Component
{
    // TO DO: Add a disable option
    constructor(
        props : Readonly<{}>,
        public content : string,
        public divClassName : string,
        public buttonClassName : string,
        public buttonOnClick : React.MouseEventHandler<HTMLButtonElement>
    )
    { super(props); }

    public render()
    {
        return(
            <div className={this.divClassName}>
                <button className={this.buttonClassName} onClick={this.buttonOnClick}>
                    {this.content}
                </button>
            </div>
        );
    }
}