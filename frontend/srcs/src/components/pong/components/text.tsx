import React from "react"

export default class Text extends React.Component
{
    constructor(
        props : Readonly<{}>,
        public content : string,
        public divClassName : string,
        public textClassName : string
    )
    { super(props); }

    render()
    {
        return (
            <div className={this.divClassName}>
                <text className={this.textClassName}>
                    {this.content}
                </text>
            </div>
        );
    }
}