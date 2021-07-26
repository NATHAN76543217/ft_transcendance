
// TO DO: import shared from module

import {
    GameStatus
} from "shared-pong/game/status"
import {
    Socket,
} from "socket.io-client"
import {
    Mesages
} from "shared-pong/utils/messages"
import {
    IDynamicDto
} from "shared-pong/dto/dynamic.dto"

import  renderGameStatus from "shared-pong/render/render"
import SettingsLimits from "shared-pong/settings/limits"

export default class PongClient
{
    public animationId : number = 0;
    constructor(
        public gameStatus : GameStatus,
        public settingsLimits : SettingsLimits,
        public socket : Socket,
        public roomId : string
    )
    {
        this.socket.on(Mesages.RECEIVE_GAMESTATUS, (status : IDynamicDto) => {
            this.gameStatus = status as GameStatus; // TO DO: Must must not overwrite this.gameStatus's frontend data
            renderGameStatus(this.gameStatus);
     });
    }

    // TO DO: Disconect clients

    public readonly run = () => {
        const frame = () => {
            this.socket.emit(Mesages.CALC_GAME_STATUS, this.roomId, this.gameStatus);
            requestAnimationFrame(frame);
        };

        this.animationId = requestAnimationFrame(frame);
    }

    // TO STOP ANIMATION: cancelAnimationFrame(this.animationId);
}
