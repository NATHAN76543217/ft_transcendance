import {
    GameStatus
} from "../game/status"
import {
    Socket,
} from "ngx-socket-io"
import {
    Mesages
} from "../server/socketserver"

import  renderGameStatus from "../render/render"
import SettingsLimits from "../settings/limits"

export default class PolimorphicEngine
{
    constructor(
        public gameStatus : GameStatus,
        public settingsLimits : SettingsLimits,
        public socket : Socket,
        public roomId : string
    )
    { }

    // TO DO: Init the engine
    // Parse mouse mov
    // Disconect clients

    // request info from room and broadcast to all
    // request next animation frame for calculation in the server
    // Use "requesNextAnimationFrame" instead setInterval

    public readonly run = () => {

        const fps : number = 50;



        setInterval(() : void => {
            this.gameStatus = this.socket.emit(Mesages.CALC_GAME_STATUS,
            this.roomId, this.gameStatus);
            renderGameStatus(this.gameStatus);
        }, 1000 / fps);
    }
}