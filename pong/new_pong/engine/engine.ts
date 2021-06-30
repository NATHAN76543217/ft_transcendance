import {
    GameStatus
} from "../game/status"
import {
    Socket,
} from "ngx-socket-io"

import  renderGameStatus from "../render/render"

export default class PongClient
{
    constructor(
        public gameStatus : GameStatus,
        public calculationLib : string,
        public socket : Socket,
        public roomId : number
    )
    {
        socket.emit('onConnextion', {
            idRoom: roomId,
            idPlayerOne: gameStatus.playerOne.id,
            idPlayerTwo: gameStatus.playerTwo.id,
            config: gameStatus
        });
    }

    // TO DO: Disconect clients

    public readonly run = () => {

        const fps : number = 50;

        setInterval(() : void => {
            this.gameStatus = this.socket.emit('calcGameStatus',
                this.calculationLib, this.gameStatus);
            renderGameStatus(this.gameStatus);
        }, 1000 / fps);
    }
}