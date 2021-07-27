import React from "react"

import LibNames from "shared-pong/utils/lib.names"
import {
    PongContext
} from "../indexPong"
import {
    Mesages,
} from "shared-pong/utils/messages"
import {
    ISpectatorDataDto
} from "shared-pong/dto/spectator.dto"

export default function Spectator()
{
    const context = React.useContext(PongContext);

    // Handler for GET_SPECTATOR_DATA's response listener
    const onReceiveData = (data : ISpectatorDataDto) => {
        const libsNames : Array<LibNames> = [
            LibNames.LIB_HORIZONTAL_MULTI,
            LibNames.LIB_VERTICAL_MULTI
        ];

        const index : number = libsNames.findIndex(elem => elem == data.libName);

        // TO DO: For fast games, how is the customized data ?
        // If is empty i must just ignore it here

        context.pongSpetializations[index][1]
            .gameStatus.playerOne.id = data.ids.idPlayerOne;
        context.pongSpetializations[index][1]
            .gameStatus.playerTwo.id = data.ids.idPlayerTwo;
        context.pongSpetializations[index][1]
            .gameStatus.ball.speed = data.customization.ballSpeed;
        context.pongSpetializations[index][1]
            .gameStatus.ball.style.data = data.customization.ballColor;
        context.pongSpetializations[index][1]
            .gameStatus.court.style.data = data.customization.courtColor;
        context.pongSpetializations[index][1]
            .gameStatus.net.style.data = data.customization.netColor;
        context.pongSpetializations[index][1]
            .gameStatus.playerOne.width = data.customization.playerOneWidth;
        context.pongSpetializations[index][1]
            .gameStatus.playerOne.height = data.customization.playerOneHeight;
        context.pongSpetializations[index][1]
            .gameStatus.playerOne.style.data = data.customization.playerOneColor;
        context.pongSpetializations[index][1]
            .gameStatus.playerTwo.width = data.customization.playerTwoWidth;
        context.pongSpetializations[index][1]
            .gameStatus.playerTwo.height = data.customization.playerTwoHeight;
        context.pongSpetializations[index][1]
            .gameStatus.playerTwo.style.data = data.customization.playerTwoColor;
        context.setPongIndex(index);

        context.socket.emit(Mesages.GAME_IS_INIT);
    };

    // Handler for GAME_IS_INIT's response listener
    const onSpectatorIsInit = () => {
        context.goToPongGame();
    };

     // Unsubcribe all listeners
    const deleteListeners = () => {
        context.socket.off(Mesages.RECEIVE_SPECTATOR_DATA, onReceiveData);
        context.socket.off(Mesages.SPECTATOR_IS_INIT, onSpectatorIsInit);
    }

    // Executed on construction only
    React.useEffect(() => {
        context.socket.on(Mesages.RECEIVE_SPECTATOR_DATA, onReceiveData);
        context.socket.on(Mesages.SPECTATOR_IS_INIT, onSpectatorIsInit);

        context.socket.emit(Mesages.JOIN_SPECTATOR, context.gameId, context.playerId);
        context.socket.emit(Mesages.GET_SPECTATOR_DATA, context.gameId);

        return deleteListeners;
    }, []);

    return <></>;
}
