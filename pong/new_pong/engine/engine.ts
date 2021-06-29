import {
    GameStatus
} from "../game/status"
import {
    Socket,
} from "ngx-socket-io"

import  renderGameStatus from "../render/render"

export default class PolimorphicEngine
{
    constructor(
        public gameStatus : GameStatus,
        public socket : Socket
    )
    { }

    // TO DO: Init the engine
    // Parse mouse mov
    // Disconect clients

    public readonly run = () => {

        const fps : number = 50;



        setInterval(() : void => {
            // this.socket.emit('mouseEvent', ) to do
            this.gameStatus = this.socket.emit('calcGameStatus', this.gameStatus);
            renderGameStatus(this.gameStatus);
        }, 1000 / fps);
    }
}