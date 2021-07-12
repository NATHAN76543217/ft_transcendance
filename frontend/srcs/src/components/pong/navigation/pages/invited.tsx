import React from "react"

import ContinousSlider from "../../components/continuousSlider"
import {
    Socket,
} from "ngx-socket-io"
import {
    RangeSlider,
} from "../../../../../../../pong/settings/dto/rangeslider"
import Text from "../../components/text"
import ButtonPong from "../../components/button";
import {
    IPongGame
} from "./gameCustom"

import {
    LIB_VERTICAL_MULTI,
    LIB_HORIZONTAL_MULTI
} from "../../../../../../../pong/engine/lib.names"
import {
    AStyle
} from "../../../../../../../pong/render/style"
import Unspected from "../../../../../../../pong/exceptions/unspected.exception"
import {
    ICustomGame
} from "../.../../../../../../../../pong/server/socketserver"

const DEFAULT_COLOR_SLIDER : number = 42;

export default class InvitedToGame extends React.Component
{
    public color : ContinousSlider = new ContinousSlider("Color", DEFAULT_COLOR_SLIDER, this.props);
    public isReady : boolean = false;
    public slidersInfo : ICustomGame;

    constructor(
        public roomId : string,
        public idPlayer : string,
        public socket : Socket,
        public data : IPongGame,
        public goBack : Function,
        public goToPong : Function,
        props : Readonly<{}>
    )
    {
        super(props);

        this.socket.emit("joinRoom", this.idPlayer);

        this.slidersInfo = this.socket.emit("updateInfo", this.roomId, this.idPlayer, {
            ballSpeed: Number(),
            ballColor: String(),
            courtColor: String(),
            netColor: String(),
            playerOneWidth: Number(),
            playerOneHeight: Number(),
            playerOneColor: String(),
            playerTwoWidth: Number(),
            playerTwoHeight: Number(),
            playerTwoColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
                limits: {
                    min: 0x00000000,
                    max: 0x00FFFFFF,
                },
                value: DEFAULT_COLOR_SLIDER
            }))
        });

        this.readyToPlay = this.readyToPlay.bind(this);
        this.onQuit = this.onQuit.bind(this);

        // TO DO:
        // Info:
        // - Customization info: both player see the customization sliders
        //          - the other player slider are disabled but the values updates real time
        // - A brief about the pong game: style , and more ? (updated real time too)
        // Brief: "Pong style: ${PONG_STYLE}"

        // -> updateInfo in customGame
        // -> replace init in the constructor by updateInfo (CustomGame)
        // -> be sure the customGame is well sync
        // -> upgrade the slider an add a disable feature
        // -> insert missing slider
        // -> update them with the shared data
        // -> end ?

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
            this.syncCustomization();
            this.socket.emit("launchGame", idRoom);
            this.goToPong();
        }
    }

    public syncCustomization()
    {
        const libsNames : Array<string> = [
            LIB_HORIZONTAL_MULTI,
            LIB_VERTICAL_MULTI
        ];

        const data : string = this.socket.emit("getGameStyle", this.roomId);
        const index : number = libsNames.findIndex(elem => elem == data);

        if (index === undefined)
            throw new Unspected("Unspected error in syncCustomisation");

        this.data.pongFinals[index].gameStatus.playerOne.id = this.socket.emit("getOtherPlayerId", this.roomId, this.idPlayer);
        this.data.pongFinals[index].gameStatus.playerTwo.id = this.idPlayer;
        this.data.pongFinals[index].gameStatus.ball.speed = this.slidersInfo.ballSpeed;
        this.data.pongFinals[index].gameStatus.ball.style.data = this.slidersInfo.ballColor;
        this.data.pongFinals[index].gameStatus.court.style.data = this.slidersInfo.courtColor;
        this.data.pongFinals[index].gameStatus.net.style.data = this.slidersInfo.netColor;
        this.data.pongFinals[index].gameStatus.playerOne.width = this.slidersInfo.playerOneWidth;
        this.data.pongFinals[index].gameStatus.playerOne.height = this.slidersInfo.playerOneHeight;
        this.data.pongFinals[index].gameStatus.playerOne.style.data = this.slidersInfo.playerOneColor;
        this.data.pongFinals[index].gameStatus.playerTwo.width = this.slidersInfo.playerTwoWidth;
        this.data.pongFinals[index].gameStatus.playerTwo.height = this.slidersInfo.playerTwoHeight;
        this.data.pongFinals[index].gameStatus.playerTwo.style.data = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
            limits: {
                min: 0x00000000,
                max: 0x00FFFFFF
            },
            value: this.color.value
        }))

        this.data.index = index;

    }

    // public syncCustomisation()
    // {
    //     this.socket.emit("exportCustomization", this.roomId, this.idPlayer, {
    //         ballSpeed: Number(),
    //         ballColor: String(),
    //         courtColor: String(),
    //         netColor: String(),
    //         playerOneWidth: Number(),
    //         playerOneHeight: Number(),
    //         playerOneColor: String(),
    //         playerTwoWidth: Number(),
    //         playerTwoHeight: Number(),
    //         playerTwoColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
    //             limits: {
    //                 min: 0x00000000,
    //                 max: 0x00FFFFFF
    //             },
    //             value: this.color.value
    //         })),
    //     });

    //     const libsNames : Array<string> = [
    //         LIB_HORIZONTAL_MULTI,
    //         LIB_VERTICAL_MULTI
    //     ];

    //     const data : string = this.socket.emit("getGameStyle", this.roomId);
    //     const index : number = libsNames.findIndex(elem => elem == data);

    //     if (index === undefined)
    //         throw new Unspected("Unspected error in syncCustomisation");

    //     let syncCustomization;

    //     // Stop until both sides has sent their customization
    //     while ((syncCustomization = this.socket.emit("importCustomization", this.roomId)) == null)
    //         ;

    //     this.data.pongFinals[index].gameStatus.playerOne.id = this.socket.emit("getOtherPlayerId", this.roomId, this.idPlayer);
    //     this.data.pongFinals[index].gameStatus.playerTwo.id = this.idPlayer;
    //     this.data.pongFinals[index].gameStatus.ball.speed = syncCustomization.ballSpeed;
    //     this.data.pongFinals[index].gameStatus.ball.style.data = syncCustomization.ballColor;
    //     this.data.pongFinals[index].gameStatus.court.style.data = syncCustomization.courtColor;
    //     this.data.pongFinals[index].gameStatus.net.style.data = syncCustomization.netColor;
    //     this.data.pongFinals[index].gameStatus.playerOne.width = syncCustomization.playerOneWidth;
    //     this.data.pongFinals[index].gameStatus.playerOne.height = syncCustomization.playerOneHeight;
    //     this.data.pongFinals[index].gameStatus.playerOne.style.data = syncCustomization.playerOneColor;
    //     this.data.pongFinals[index].gameStatus.playerTwo.width = syncCustomization.playerTwoWidth;
    //     this.data.pongFinals[index].gameStatus.playerTwo.height = syncCustomization.playerTwoHeight;
    //     this.data.pongFinals[index].gameStatus.playerTwo.style.data = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
    //         limits: {
    //             min: 0x00000000,
    //             max: 0x00FFFFFF
    //         },
    //         value: this.color.value
    //     }))

    //     this.data.index = index;
    // }

    public onQuit()
    {
        this.socket.emit("leaveRoom", this.roomId, this.idPlayer);
        this.goBack();
    }

    public updateInfo()
    {
        this.slidersInfo.playerTwoColor = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
            limits: {
                min: 0x00000000,
                max: 0x00FFFFFF
            },
            value: this.color.value
            }),
        );
        this.slidersInfo = this.socket.emit("updateInfo", this.roomId, this.idPlayer, this.slidersInfo);
    }

    public render()
    {
        this.updateInfo();

        return(
            <div className="">
                {
                    new Text(
                        this.props,
                        this.slidersInfo.gameBrief ? this.slidersInfo.gameBrief : "UNSPECTED ERROR",
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
