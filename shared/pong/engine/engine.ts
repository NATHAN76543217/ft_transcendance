
// TO DO: import shared from module

import {
    GameStatus
} from "../game/status"
import {
    Socket,
} from "socket.io-client"
import {
    Mesages
} from "../utils/messages"
import {
    IDynamicDto
} from "../dto/dynamic.dto"

import  renderGameStatus from "../render/render"
import SettingsLimits from "../settings/limits"

// TO DO: Move to the front after fix server issue

export default class PongClient
{
    constructor(
        public gameStatus : GameStatus,
        public settingsLimits : SettingsLimits,
        public socket : Socket,
        public roomId : string
    )
    { }

    // TO DO: Disconect clients

    // request info from room and broadcast to all
    // request next animation frame for calculation in the server
    // Use "requesNextAnimationFrame" instead setInterval


    // TO DO: Fix and uncomment this listener
    // this.socket.on(Mesages.RECEIVE_GAMESTATUS, (status : IDynamicDto) => {
    //     this.gameStatus = status;
    // });

    public readonly run = () => {

        const fps : number = 50;

        setInterval(() : void => {
            this.socket.emit(Mesages.CALC_GAME_STATUS, this.roomId, this.gameStatus);
            renderGameStatus(this.gameStatus);
        }, 1000 / fps);
    }
}
