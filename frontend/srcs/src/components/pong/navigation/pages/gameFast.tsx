import React from "react"

import ButtonPong from "../../components/button";
import Text from "../../components/text"
import {
    Socket
} from "ngx-socket-io"

export default class GameFast extends React.Component
{
    public idRoom? : string = undefined;

    constructor(
        props : Readonly<{}>,
        public playerId : string,
        public socket : Socket,
        public goBack : Function,
        public goToPong : Function
    )
    {
        super(props);

        // TO DO: Call endGame in the server when the game is end
    }

    public cancelQueue()
    {
        this.socket.emit("cancelQueue", this.playerId, this.idRoom);
        this.goBack();
    }

    public render()
    {
        // TO DO: This will work if react call iterativaly render()
        this.idRoom = this.socket.emit("FindGame", this.playerId);

        // Same
        if (this.socket.emit("isInQueue", "", "") == false)
            this.goToPong();

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
                        this.cancelQueue
                   )
               }
            </div>
        );
    }
}
