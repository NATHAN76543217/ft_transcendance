import React from "react"

import ContinousSlider from "../../components/continuousSlider"
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"
import {
    RangeSlider,
    IRangeSliderDto
} from "../../../../../../../pong/settings/dto/rangeslider"
import Text from "../../components/text"
import ButtonPong from "../../components/button";

export default class InvitedToGame extends React.Component
{
    public socket : Socket = new Socket({
        url: 'http://localhost',
        options: {}
    } as SocketIoConfig);

    public color : ContinousSlider = new ContinousSlider("Color", 0, this.props);
    public isReady : boolean = false;

    constructor(
        public roomId : string,
        public idPlayer : string,
        public gameInfo : string,
        public goToPong : Function,
        props : Readonly<{}>
    )
    {
        super(props);

        this.socket.emit("joinRoom", this.idPlayer);

        this.readyToPlay = this.readyToPlay.bind(this);
        this.onQuit = this.onQuit.bind(this);

        // TO DO: On quit like customGame
        // TO DO: Connect to the index (indexPong.tsx)
        // TO DO: syncCustomisation TO DOs
    }

    public readyToPlay()
    {
        const idRoom : string = this.roomId;

        if (this.isReady == false)
        {
            this.socket.emit("playerIsReady", idRoom, this.idPlayer);
            this.isReady = true;
        }
        else
        {
            this.socket.emit("playerIsNotReady", idRoom, this.idPlayer);
            this.isReady = false;
        }

        if (this.socket.emit("arePlayersReady", idRoom))
        {
            this.syncCustomisation();
            this.socket.emit("launchGame", idRoom);
            this.goToPong();
        }
    }

    public syncCustomisation()
    {
        this.socket.emit("exportCustomization", this.roomId, this.idPlayer, {
            ballSpeed: Number(),
            ballColor: String(),
            courtColor: String(),
            netColor: String(),
            playerOneWidth: Number(),
            playerOneHeight: Number(),
            playerOneColor: String(),
            playerTwoWidth: Number(),
            playerTwoHeight: Number(),
            playerTwoColor: RangeSlider.RangeSliderValue({
                limits: {
                    min: 0x00000000,
                    max: 0x00FFFFFF
                },
                value: this.color.value
            }),
        });

        // TO DO: Use libname in IRoomDto to know the needed pong
        // TO DO: Need a config to edit and a pong engine to launch
        // TO DO: [COMPLEXITY] The pong engine need to change if playerOne change it (use the server to achieve this)
        //      That means change info too.

        let syncCustomization;

        // Stop until both sides has sent their customization
        while ((syncCustomization = this.socket.emit("importCustomization", this.roomId)) == null)
            ;

        // TO DO: Syncronize the config of the pong engine here
        // TO DO: Add to the engine (in the front) the playerOne id

        // TO DO: Add in the client the other's player id
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
