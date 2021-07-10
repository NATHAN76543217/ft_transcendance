import React from "react"

import ContinousSlider from "../../components/continuousSlider"
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"
import Text from "../../components/text"
import ButtonPong from "../../components/button";

export default class InvitedToGame extends React.Component
{
    public socket : Socket = new Socket({
        url: 'http://localhost',
        options: {}
    } as SocketIoConfig);

    public color : ContinousSlider = new ContinousSlider("Color", 0, this.props);

    constructor(
        public roomId : string,
        public idPlayer : string,
        public gameInfo : string,
        props : Readonly<{}>
    )
    {
        super(props);

        this.socket.emit("joinRoom", this.idPlayer);

        this.readyToPlay = this.readyToPlay.bind(this);
        this.onQuit = this.onQuit.bind(this);

        // TO DO: On quit like customGame
        // TO DO: ReadyToPlay like customGame
        // TO DO: Connect to the index (indexPong.tsx)
        // TO DO: Merge configs
    }

    public readyToPlay()
    {
        // Shoud send to the server a "Readdy to play" message
        // If both players sent it in a specific time duration
        // There is a timeout, the game starts and this.summitGameConfig is called


        // at the end: (if both player clicked in the button and waited the time ...)
        // this.summitGameConfig(); -> send custom data to host1
        // TO DO: Launch the game in react
        // Launch game for invited -> should just load the game/id canvas
    }

    public onQuit()
    {
        this.socket.emit("leaveRoom", this.roomId, this.idPlayer);
        // Quit in the front too

        // TO DO: If playerOne (the host) leaves and playerTwo
        // remains in the room there are 2 options:
        //  -1) The room is destroyed (easy way)
        //  -2) PlayerTwo become playerOne in the front and the back
    }

    public render()
    {
        return(
            <div className="">
                {
                    new Text(
                        this.props,
                        this.gameInfo,
                        "",
                        ""
                    )
                }
                <div className="">
                    {this.color}
                </div>
                {
                    new ButtonPong(
                        this.props,
                        "Ready",
                        "",
                        "",
                        this.readyToPlay
                    )
                }
                {
                    new ButtonPong(
                        this.props,
                        "Quit",
                        "",
                        "",
                        this.onQuit
                    )
                }
            </div>
        );
    }
}
