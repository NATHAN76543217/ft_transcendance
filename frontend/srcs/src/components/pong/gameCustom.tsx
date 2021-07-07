
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

import ContinousSlider from "./continuousSlider"

import {
    GameMode
} from "../../../../../pong/engine/polimorphiclib"
import {
    GameStatus
} from "../../../../../pong/game/status"
import PongGenerator from ".././../../../../pong/engine/engine"
import  ClassicPong from "../../../../../pong/specilizations/classicpong/classicpong.engine"
import {
    IRoomDto
} from "../../../../../pong/server/socketserver"

// TO DO if i can create a socket like that
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"

export default class GameCustom extends React.Component
{
    public gameMode : GameMode = GameMode.MULTI_PLAYER;
    public index : number = 0;
    public socket : Socket = new Socket({
        url: 'http://localhost',
        options: {}
    } as SocketIoConfig);
    public pongStyles : Array<string> = [
        "Classic Pong",
        //"Vertical Pong"
    ];
    public pongFinals : Array<PongGenerator> = [
        new ClassicPong(
            this.idRoom,
            this.idRoom, // idRoom == idPlayerOne
            String(),
            this.socket
        ),
        // TO DO: Vertical pong specilisation
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
        public idRoom : string,
        props : Readonly<{}>
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

        this.onPrevPongStyle = this.onPrevPongStyle.bind(this);
        this.onNextPongStyle = this.onNextPongStyle.bind(this);
        this.onSinglePlayer = this.onSinglePlayer.bind(this);
        this.onMultiplayer = this.onMultiplayer.bind(this);
        this.onInvite = this.onInvite.bind(this);
        this.summitGameConfig = this.summitGameConfig.bind(this);
        this.onQuit = this.onQuit.bind(this);
    }

    public onNextPongStyle()
    { this.index = (this.index + 1) % this.pongStyles.length; }

    public onPrevPongStyle()
    { this.index = (this.index - 1) % this.pongStyles.length; }

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
        this.socket.emit("launchGame", this.pongFinals[this.index].roomId);
    }

    // TO DO: Call this function
    public summitGameConfig()
    {
        // TO DO: Must be called before start the game
        // When is 100% sure that the game will start

        // TO DO: Should denormalize the values using the
        // limitsConfig of the sellected engine
        // NOTE: I think is implemented but not in the PongGenerator yet

        for (let i of this.gameConfig)
        {
            switch(i.name)
            {
                // TO DO: Like that for each one
                case "test": this.pongFinals[this.index].gameStatus.ball.style.data = "";
            }
        }
    }

    public onQuit()
    {
        this.socket.emit("leaveRoom", this.pongFinals[this.index].roomId);
        // TO DO: Redirect back in React
    }

    public render()
    {
        return (
            <div className="">

                {/* Button that changes the pong style*/}
                <div className="">
                    <div className="">
                        <button className="" onClick={this.onPrevPongStyle}>
                            Arrow Left
                        </button>
                        <text className="">
                            {this.pongStyles[this.index]}{"\n"}
                        </text>
                        <button className="" onClick={this.onNextPongStyle}>
                            Arrow Right
                        </button>
                    </div>
                </div>

                {/* Button that selects the game mode */}
                <div className="">
                    <div className="">
                        <button className="" onClick={this.onSinglePlayer}>
                            Single Player
                        </button>
                        <button className="" onClick={this.onMultiplayer}>
                            Multi Player
                        </button>
                    </div>
                </div>

                {/* Optional button invite */}
                <div className=""> {this.gameMode == GameMode.MULTI_PLAYER ?
                    <button className="" onClick={this.onInvite}>
                        Invite
                    </button> : 0}
                </div>

                {/* Range slider that ables the user to customize the game */}
                {/* TO DO: Fill it with properties */}
                <div className="">
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
                    <div className="">
                        {this.gameConfig[4]}
                    </div>
                    <div className="">
                        {this.gameConfig[5]}
                    </div>
                    <div className="">
                        {this.gameConfig[6]}
                    </div>
                    <div className="">
                        {this.gameConfig[7]}
                    </div>
                    {/* TO DO: If game is single payer store the bot difficulty
                    And a user is able to customie all the game */}
                </div>

                {/* Readdy to play button */}
                <div className="">
                    {this.gameMode == GameMode.SINGLE_PLAYER || this.gameMode == GameMode.MULTI_PLAYER && 1 /* Other player has join */ ? 
                    <button className="" onClick={this.readyToPlay}>
                        Readdy
                    </button> : 0}
                </div>

                {/* Leave the room button */}
                <div className="">
                    <button className="" onClick={this.onQuit}>
                        Quit
                    </button>
                </div>

            </div>
        );
    }
}
