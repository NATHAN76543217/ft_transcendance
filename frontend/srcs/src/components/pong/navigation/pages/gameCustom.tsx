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
    Socket,
} from "ngx-socket-io"
import ButtonPong from '../../components/button'
import PongSlyleSelector from '../../components/ponsStyleSelector'
import {
    Customization,
    BALL_SPEED,
    BALL_COLOR,
    COURT_COLOR,
    NET_COLOR,
    PLAYER_ONE_WIDTH,
    PLAYER_ONE_HEIGHT,
    PLAYER_ONE_COLOR,
    PLAYER_TWO_WIDTH,
    PLAYER_TWO_HEIGHT,
    PLAYER_TWO_COLOR,
    BOT_LEVEL
} from '../../components/customization'
import {
    LIB_VERTICAL_SINGLE,
    LIB_VERTICAL_MULTI,
    LIB_HORIZONTAL_SINGLE,
    LIB_HORIZONTAL_MULTI
} from "../../../../../../../pong/engine/lib.names"

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

    public isReady : boolean = false;
    public gameConfig : Array<ContinousSlider> = [];

    constructor(
        props : Readonly<{}>,
        public idRoom : string,
        public socket : Socket,
        public data : IPongGame,
        public goBack : React.MouseEventHandler<HTMLButtonElement>,
        public goToPong : Function
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
            customization: { },
            flags: 0
        } as IRoomDto);

        this.updateGameConfig = this.updateGameConfig.bind(this);
        this.onSinglePlayer = this.onSinglePlayer.bind(this);
        this.onMultiplayer = this.onMultiplayer.bind(this);
        this.onInvite = this.onInvite.bind(this);
        this.summitGameConfig = this.summitGameConfig.bind(this);
        this.onQuit = this.onQuit.bind(this);

        this.updateGameConfig();

        // TO DO: Finish a game and call server's endGame
        // TO DO: Check if bot level is well connected in all the layers
    }

    private updateGameConfig() : void
    {
        this.gameConfig = [
            new ContinousSlider(
                BALL_SPEED,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.ballSpeed, 
                    this.data.pongFinals[this.data.index].gameStatus.ball.speed),
                this.props
            ),
            new ContinousSlider(
                BALL_COLOR,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.colorLimit, 
                    this.data.pongFinals[this.data.index].gameStatus.ball.style.toNumber()),
                this.props
            ),
            new ContinousSlider(
                COURT_COLOR,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.colorLimit, 
                    this.data.pongFinals[this.data.index].gameStatus.court.style.toNumber()),
                this.props
            ),
            new ContinousSlider(
                NET_COLOR,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.colorLimit, 
                    this.data.pongFinals[this.data.index].gameStatus.net.style.toNumber()),
                this.props
            ),
            new ContinousSlider(
                PLAYER_ONE_WIDTH,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.playerOneWidth, 
                    this.data.pongFinals[this.data.index].gameStatus.playerOne.width),
                this.props
            ),
            new ContinousSlider(
                PLAYER_ONE_HEIGHT,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.playerOneHeight, 
                    this.data.pongFinals[this.data.index].gameStatus.playerOne.height),
                this.props
            ),
            new ContinousSlider(
                PLAYER_ONE_COLOR,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.colorLimit, 
                    this.data.pongFinals[this.data.index].gameStatus.playerOne.style.toNumber()),
                this.props
            ),
            new ContinousSlider(
                PLAYER_TWO_WIDTH,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.playerTwoWidth, 
                    this.data.pongFinals[this.data.index].gameStatus.playerTwo.width),
                this.props
            ),
            new ContinousSlider(
                PLAYER_TWO_HEIGHT,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.playerTwoHeight, 
                    this.data.pongFinals[this.data.index].gameStatus.playerTwo.height),
                this.props
            ),
            new ContinousSlider(
                PLAYER_TWO_COLOR,
                RangeSlider.toRange(this.data.pongFinals[this.data.index].settingsLimits.colorLimit, 
                    this.data.pongFinals[this.data.index].gameStatus.playerTwo.style.toNumber()),
                this.props
            ),
            new ContinousSlider(
                BOT_LEVEL,
                RangeSlider.toRange({ // TO DO: Better
                    min: 0.1,
                    max: 0.7
                }, 0.1),
                this.props
            )
        ];
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
        const idRoom : string = this.idRoom;

        if (this.isReady == false)
        {
            // If idRoom == idPlayerOne ... both args are idRoom
            this.socket.emit("playerIsReady", idRoom, idRoom);
            this.isReady = true;
        }
        else
        {
            // If idRoom == idPlayerOne ... both args are idRoom
            this.socket.emit("playerIsNotReady", idRoom, idRoom);
            this.isReady = false;
        }

        if (this.socket.emit("arePlayersReady", idRoom))
        {
            this.summitGameStyle();
            this.summitGameConfig();
            if (this.gameMode == GameMode.MULTI_PLAYER)
                this.data.pongFinals[this.data.index].gameStatus.playerTwo.id = this.socket.emit("getOtherPlayerId", this.idRoom, this.idRoom);
            this.socket.emit("updateConfig", this.data.pongFinals[this.data.index].gameStatus);
            this.socket.emit("launchGame", idRoom);
            this.goToPong();
        }
    }

    public summitGameStyle()
    {
        // just need sames indexes as pong styles
        const libs : Array<[string, string]> = [
            [LIB_HORIZONTAL_SINGLE, LIB_HORIZONTAL_MULTI],
            [LIB_VERTICAL_SINGLE, LIB_VERTICAL_MULTI]
        ];

        this.socket.emit("setUpGameStyle", libs[this.data.index][Number(this.gameMode == GameMode.MULTI_PLAYER)]);
    }

    public summitGameConfig()
    {
        const pong : PongGenerator = this.data.pongFinals[this.data.index];

        for (let i of this.gameConfig)
        {
            switch(i.name)
            {
                case BALL_SPEED: this.data.pongFinals[this.data.index].gameStatus.ballSpeed = new RangeSlider(pong.settingsLimits.ballSpeed, i.value); break ;
                case BALL_COLOR: this.data.pongFinals[this.data.index].gameStatus.ballColor = new RangeSlider(pong.settingsLimits.colorLimit, i.value); break ;
                case COURT_COLOR: this.data.pongFinals[this.data.index].gameStatus.courtColor = new RangeSlider(pong.settingsLimits.colorLimit, i.value); break ;
                case NET_COLOR: this.data.pongFinals[this.data.index].gameStatus.netColor = new RangeSlider(pong.settingsLimits.colorLimit, i.value); break ;
                case PLAYER_ONE_WIDTH: this.data.pongFinals[this.data.index].gameStatus.player1Width = new RangeSlider(pong.settingsLimits.playerOneWidth, i.value); break ;
                case PLAYER_ONE_HEIGHT: this.data.pongFinals[this.data.index].gameStatus.player1Height = new RangeSlider(pong.settingsLimits.playerOneHeight, i.value); break ;
                case PLAYER_ONE_COLOR: this.data.pongFinals[this.data.index].gameStatus.player1Color = new RangeSlider(pong.settingsLimits.colorLimit, i.value); break ;

                case PLAYER_TWO_WIDTH:
                    if (this.gameMode == GameMode.SINGLE_PLAYER)
                        this.data.pongFinals[this.data.index].gameStatus.player2Width = new RangeSlider(pong.settingsLimits.playerTwoWidth, i.value);
                    else
                    this.data.pongFinals[this.data.index].gameStatus.player2Width = 
                        this.data.pongFinals[this.data.index].gameStatus.player1Width
                    break ;
                case PLAYER_TWO_HEIGHT:
                    if (this.gameMode == GameMode.SINGLE_PLAYER)
                        this.data.pongFinals[this.data.index].gameStatus.player2Height = new RangeSlider(pong.settingsLimits.playerTwoHeight, i.value);
                    else
                    this.data.pongFinals[this.data.index].gameStatus.player2Height =
                        this.data.pongFinals[this.data.index].gameStatus.player1Height
                    break ;
                case PLAYER_TWO_COLOR:
                    if (this.gameMode == GameMode.SINGLE_PLAYER)
                        this.data.pongFinals[this.data.index].gameStatus.player2Color = new RangeSlider(pong.settingsLimits.colorLimit, i.value);
                    else
                        ; // TO DO: Color will be the one selected by the invited playerTwo
                    break ;
                case BOT_LEVEL:
                    if (this.gameMode == GameMode.SINGLE_PLAYER)
                        this.socket.emit("setUpBotLevel", this.idRoom, RangeSlider.RangeSliderValue({
                            limits: {
                                min: 0,
                                max: 1 // TO DO: Probally wrong limits
                            },
                            value: i.value
                        }));
                    break ;

                default: throw new Error(); // Unspected Exception
            }
        }
    
        this.socket.emit("exportCustomization", this.idRoom, this.idRoom, {
            ballSpeed: this.data.pongFinals[this.data.index].gameStatus.ball.speed,
            ballColor: this.data.pongFinals[this.data.index].gameStatus.ball.style.data,
            courtColor: this.data.pongFinals[this.data.index].gameStatus.court.style.data,
            netColor: this.data.pongFinals[this.data.index].gameStatus.net.style.data,
            playerOneWidth: this.data.pongFinals[this.data.index].gameStatus.playerOne.width,
            playerOneHeight: this.data.pongFinals[this.data.index].gameStatus.playerOne.height,
            playerOneColor: this.data.pongFinals[this.data.index].gameStatus.playerOne.style.data,
            playerTwoWidth: this.data.pongFinals[this.data.index].gameStatus.playerTwo.width,
            playerTwoHeight: this.data.pongFinals[this.data.index].gameStatus.playerTwo.height,
            playerTwoColor: String()
        });

        let syncCustomization;

        // Stop until both sides has sent their customization
        while ((syncCustomization = this.socket.emit("importCustomization", this.idRoom)) == null)
            ;
        this.data.pongFinals[this.data.index].gameStatus.playerTwo.style.data = syncCustomization.playerTwoColor;
    }

    public onQuit()
    {
        this.socket.emit("leaveRoom", this.data.pongFinals[this.data.index].roomId);
        // TO DO: Redirect back in React (where should user go after this ?)
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
                        this.updateGameConfig
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
