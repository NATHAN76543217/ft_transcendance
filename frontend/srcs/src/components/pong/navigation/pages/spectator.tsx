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

interface IIds
{
    idPlayerOne: string;
    idPlayerTwo: string;
}

export default function Spectator()
{
    const context = React.useContext(PongContext);

    const [gameStyle, setGameStyle] = React.useState<LibNames>();
    const [gameCustomization, setGameCustomization] = React.useState<ICustomGame>();
    const [playersIds, setPlayersIds] = React.useState<IIds>();

    context.socket.on(Mesages.RECEIVE_GAME_STYLE, (receivedLib : LibNames) => {
        setGameStyle(receivedLib);
    });

    context.socket.on(Mesages.RECEIVE_GAME_CUSTOMIZATION, (customization : ICustomGame) => {
        setGameCustomization(customization);
    });

    context.socket.on(Mesages.RECEIVE_PLAYERS_IDS, (ids : IIds) => {
        setPlayersIds(ids);
    });

    context.socket.emit(Mesages.JOIN_SPECTATOR, context.gameId, context.playerId);
    context.socket.emit(Mesages.GET_GAME_STYLE, context.gameId);

    // TO DO: For fast games, how is the customized data ?
    // If is empty i must just ignore it here

    const libsNames : Array<string> = [
        LibNames.LIB_HORIZONTAL_MULTI,
        LibNames.LIB_VERTICAL_MULTI
    ];

    const index : number = libsNames.findIndex(elem => elem == gameStyle);

    if (index === undefined)
        throw new Unspected("Unspected error in spectator");

    context.socket.emit(Mesages.GET_CUSTOMIZATION, context.gameId);
    context.socket.emit(Mesages.GET_PLAYERS_IDS, context.gameId);

    // TO DO: Somehow wait a bit and syncronize (values can be undefined ...)

    if (!gameStyle || !gameCustomization || !playersIds)
        throw new Unspected("Unsyncronized spectator");

    context.pongSpetializations[index][1]
        .gameStatus.playerOne.id = playersIds.idPlayerOne;
    context.pongSpetializations[index][1]
        .gameStatus.playerTwo.id = playersIds.idPlayerTwo;
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
