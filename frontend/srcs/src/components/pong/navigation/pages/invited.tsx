
// Should contain some information about the game
// Then some ranges sliders config
// Then button Readdy and Quit

import React from "react"

import ContinousSlider from "../../components/continuousSlider"
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"

export default class InvitedToGame extends React.Component
{
    public socket : Socket = new Socket({
        url: 'http://localhost',
        options: {}
    } as SocketIoConfig);
    public gameConfig : Array<ContinousSlider> = [
        new ContinousSlider("test", 0, this.props),
        new ContinousSlider("test1", 0, this.props),
        new ContinousSlider("test2", 0, this.props),
        new ContinousSlider("test3", 0, this.props),
    ];

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
                
                {/* Some informative data about the game*/}
                <div className="">
                    <text className="">
                        {this.gameInfo}
                    </text>
                </div>

                {/* Some custimizable game features */}
                <div className="">
                    {this.gameConfig[0]}
                </div>
                <div className="">
                    {this.gameConfig[1]}
                </div>
                <div className="">
                    {this.gameConfig[2]}
                </div>
                <div className="">
                    {this.gameConfig[3]}
                </div>

                {/* Ready button */}
                <div className="">
                    <button className="" onClick={this.readyToPlay}>
                        Ready
                    </button>
                </div>

                {/* Quit button */}
                <div className="">
                    <button className="" onClick={this.onQuit}>
                        Quit
                    </button>
                </div>


            </div>
        );
    }
}
