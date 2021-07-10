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
    {
        super(props);

        // TO DO: Call find game in the server
        // TO DO: NEED TO KNOW WHEN A GAME IS FOUND, THEN GO TO GAME (launchGame on the server)
        //      THIS GAME NEED TO HAVE A DEFAULT CONFIG
        // TO DO: Call endGame in the server when the game is end

    }

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