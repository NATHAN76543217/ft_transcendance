
// 2nd layer: User has clicked on "fast game"
// Just need to do something while the user is searching for a match

import React from "react"
import ButtonPong from "../../components/button";
import Text from "../../components/text"

export default class GameFast extends React.Component
{
    constructor(
        props : Readonly<{}>,
        public goBack : React.MouseEventHandler<HTMLButtonElement>,
        public goToPong : React.MouseEventHandler<HTMLButtonElement>
    )
    { super(props); }

    // I know i must do things here but not sure about what exactly
    render()
    {
        return(
            <div className="">
               {
                   new Text(
                       this.props,
                       "In queue ...",
                       "",
                       ""
                   )
               }
               {
                   new ButtonPong(
                        this.props,
                        "Cancel",
                        "",
                        "",
                        this.goBack
                   )
               }
            </div>
        );
    }
}