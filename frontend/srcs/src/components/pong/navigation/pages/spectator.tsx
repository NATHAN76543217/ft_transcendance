import React from "react"

import LibNames from "shared-pong/utils/lib.names"

// TO DO: merge exceptions
import Unspected from "shared-pong/game/exceptions/unspected.exception"

import {
    PongContext
} from "../indexPong"
import {
    Mesages,
} from "shared-pong/utils/messages"
import {
    ICustomGame
} from "shared-pong/dto/customgame.dto"

export default function Spectator()
{
    const context = React.useContext(PongContext);

    // Problems with socket libs
    // context.socket.join(context.gameId); // Bad socket lib ?
    //context.socket.to(context.gameId).emit('room', `User: ${context.playerId} is spectating game ${context.gameId}.`);

    const gameStyle : LibNames =
        context.socket.emit(Mesages.GET_GAME_STYLE, context.gameId);

    // TO DO: For fast games, how is the customized data ?
    // If is empty just i must ignore it here

    const libsNames : Array<string> = [
        LibNames.LIB_HORIZONTAL_MULTI,
        LibNames.LIB_VERTICAL_MULTI
    ];

    const index : number = libsNames.findIndex(elem => elem == gameStyle);

    if (index === undefined)
        throw new Unspected("Unspected error in spectator");

    const gameCustomization : ICustomGame =
        context.socket.emit(Mesages.GET_CUSTOMIZATION, context.gameId);

    const ids : { idPlayerOne : string, idPlayerTwo : string } =
        context.socket.emit(Mesages.GET_PLAYERS_IDS, context.gameId);

    context.pongSpetializations[index][1]
        .gameStatus.playerOne.id = ids.idPlayerOne;
    context.pongSpetializations[index][1]
        .gameStatus.playerTwo.id = ids.idPlayerTwo;
    context.pongSpetializations[index][1]
        .gameStatus.ball.speed = gameCustomization.ballSpeed;
    context.pongSpetializations[index][1]
        .gameStatus.ball.style.data = gameCustomization.ballColor;
    context.pongSpetializations[index][1]
        .gameStatus.court.style.data = gameCustomization.courtColor;
    context.pongSpetializations[index][1]
        .gameStatus.net.style.data = gameCustomization.netColor;
    context.pongSpetializations[index][1]
        .gameStatus.playerOne.width = gameCustomization.playerOneWidth;
    context.pongSpetializations[index][1]
        .gameStatus.playerOne.height = gameCustomization.playerOneHeight;
    context.pongSpetializations[index][1]
        .gameStatus.playerOne.style.data = gameCustomization.playerOneColor;
    context.pongSpetializations[index][1]
        .gameStatus.playerTwo.width = gameCustomization.playerTwoWidth;
    context.pongSpetializations[index][1]
        .gameStatus.playerTwo.height = gameCustomization.playerTwoHeight;
    context.pongSpetializations[index][1]
        .gameStatus.playerTwo.style.data = gameCustomization.playerTwoColor;
    context.setPongIndex(index);

    context.goToPongGame();

    return <></>;
}
