
// 2nd layer: user clicked on "custom game"
// Has 2 buttons that enable to sellect the pong style (go next, go back throght a list of pong styles)
// Has 2 buttons that select if the game is MULTI or SINGLE
// Has some range slider that enables user to customize the game
// Has an optional button (invite) that is visible only if the "multiplayer option is eanbled"
//  Obiouslly if a player is invited and the gamemode changes the single player, the invited player is kicked out

// Here some details:
// Single player: User can customize all
// Mutiplayer: Host can only customze it side and the shared objects, invited one only it side

import React from 'react'

import ContinousSlider from "../../components/continuousSlider"

import {
    GameMode
} from "../../../../../../../pong/engine/polimorphiclib"
import {
    GameStatus
} from "../../../../../../../pong/game/status"
import PongGenerator from "../../../../../../../pong/engine/engine"
import {
    IRoomDto
} from "../../../../../../../pong/server/socketserver"
import {
    RangeSlider,
    IRangeSliderDto
} from "../../../../../../../pong/settings/dto/rangeslider"
import {
    Range
} from "../../../../../../../pong/settings/dto/range"

import {
    Socket,
} from "ngx-socket-io"
import ButtonPong from '../../components/button'
import PongSlyleSelector from '../../components/ponsStyleSelector'
import Customization from '../../components/customization'

export interface IPongGame
{
    index : number;
    pongFinals : Array<PongGenerator>
}

export default class GameCustom extends React.Component
{
    public gameMode : GameMode = GameMode.MULTI_PLAYER;
    
    public pongStyles : Array<string> = [
        "Classic Pong",
        //"Vertical Pong"
    ];

    public gameConfig : Array<ContinousSlider> = [
        new ContinousSlider("test", 0, this.props),
        new ContinousSlider("test1", 0, this.props),
        new ContinousSlider("test2", 0, this.props),
        new ContinousSlider("test3", 0, this.props),
        new ContinousSlider("test4", 0, this.props),
        new ContinousSlider("test5", 0, this.props),
        new ContinousSlider("test6", 0, this.props),
        new ContinousSlider("test7", 0, this.props),
    ];

    constructor(
        props : Readonly<{}>,
        public idRoom : string,
        public socket : Socket,
        public data : IPongGame,
        public goBack : React.MouseEventHandler<HTMLButtonElement>,
        public goToPong : React.MouseEventHandler<HTMLButtonElement>
    )
    {
        super(props);

        this.socket.emit("createRoom", {
            isFilled: false,
            idRoom: idRoom,
            idPlayerOne: idRoom,
            idPlayerTwo: String(),
            config: { },
            lib: { },
            libName: String(),
            mode: this.gameMode,
        } as IRoomDto)

        this.onSinglePlayer = this.onSinglePlayer.bind(this);
        this.onMultiplayer = this.onMultiplayer.bind(this);
        this.onInvite = this.onInvite.bind(this);
        this.summitGameConfig = this.summitGameConfig.bind(this);
        this.onQuit = this.onQuit.bind(this);
    }

    public onSinglePlayer()
    {
        this.gameMode = GameMode.SINGLE_PLAYER;
        // TO DO: Make the button apparence as a clicked button
    }

    public onMultiplayer()
    {
        this.gameMode = GameMode.MULTI_PLAYER;
        // TO DO: Make the button apparence as a clicked button
    }

    public onInvite()
    {
        // TO DO: Should notify the target user and should
        // be able to join the game and modify it own game config

        // TO DO: If a player is invited and the host changes the
        // gameMode to SINGLE_PLAYER the invited player is kicked out
    }

    public readyToPlay()
    {
        // Shoud send to the server a "Readdy to play" message
        // If both players sent it in a specific time duration
        // There is a timeout, the game starts and this.summitGameConfig is called


        // at the end: (if both player clicked in the button and waited the time ...)
        this.summitGameConfig();
        // TO DO: Launch the game in react
        this.socket.emit("launchGame", this.data.pongFinals[this.data.index].roomId);
    }

    // TO DO: Call this function
    public summitGameConfig()
    {
        // TO DO: Must be called before start the game
        // When is 100% sure that the game will start

        // TO DO: Should denormalize the values using the
        // limitsConfig of the sellected engine
        // NOTE: I think is implemented but not in the PongGenerator yet

        const pong : PongGenerator = this.data.pongFinals[this.data.index];

        for (let i of this.gameConfig)
        {
            switch(i.name)
            {
                // TO DO: Like that for each one
                case "playerOneColor": this.data.pongFinals[this.data.index].gameStatus.player1Color = new RangeSlider(pong.settingsLimits.colorLimit, i.value);
            }
        }
    }

    public onQuit()
    {
        this.socket.emit("leaveRoom", this.data.pongFinals[this.data.index].roomId);
        // TO DO: Redirect back in React
    }

    public render()
    {
        return (
            <div className="">
                {
                    new PongSlyleSelector(
                        this.props,
                        "",
                        this,
                    )
                }
                <div className="">
                    {
                        new ButtonPong(
                            this.props,
                            "Single Player",
                            "",
                            "",
                            this.onSinglePlayer
                        )
                    }
                    {
                        new ButtonPong(
                            this.props,
                            "Multi Player",
                            "",
                            "",
                            this.onMultiplayer
                        )
                    }
                </div>
                {
                    // TO DO: Instead of not display it just disable it
                    this.gameMode == GameMode.MULTI_PLAYER
                        ? new ButtonPong(
                            this.props,
                            "Invite",
                            "",
                            "",
                            this.onInvite
                        )
                        : 0
                }
                {
                    // TO DO: If single player: All cusmizable + bot level
                    // If multiplayer: Only playerOne and Court are customizables
                    new Customization(
                        this.props,
                        this,
                        "",
                        ""
                    )
                }
                {
                    // TO DO: Instead of not display it just disable it
                    this.gameMode == GameMode.SINGLE_PLAYER || (this.gameMode == GameMode.MULTI_PLAYER && 1 /* Other player has join and is readdy */)
                        ? new ButtonPong(
                            this.props,
                            "Ready",
                            "",
                            "",
                            this.readyToPlay
                        )
                        : 0
                }
                {
                    new ButtonPong(
                        this.props,
                        "Back",
                        "",
                        "",
                        this.goBack
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
