import React from "react"

import ButtonPong from "../../components/button";
import Text from "../../components/text"
import {
    PongContext
} from "../indexPong"

import {
    Mesages
} from "shared-pong/utils/messages"
import {
    Timer
} from "../../components/timer"

export default function GameFast()
{
    const context = React.useContext(PongContext);

    const findingGame : string = "Finding Game ...\nTime: ";

    // True if player is search for a game
    const [inQueue, setInQueue] = React.useState<boolean>(false);

    // JSX object representing the duration of the search
    const [timer, setTimer] = React.useState<JSX.Element>(<></>);

    const [allReady, setAllReady] = React.useState<boolean>(false);

    context.socket.on(Mesages.RECEIVE_PLAYERS_ARE_READY, (status : boolean) => {
        setAllReady(true);
    });

    React.useEffect(() => {
        setTimer(inQueue == true ? <Timer prefix={findingGame}/> : <></>);
    }, [inQueue]);

    // True if a game is found
    const [gameFound, setGameFound] = React.useState<boolean>(false);

    context.socket.on(Mesages.RECEIVE_GAME_FOUND, () => {
        setGameFound(true);
    });

    // JXS object representing an accept/cancel buton for the found game
    const [readyButton, setReadyButton] = React.useState<JSX.Element>(<></>);

    // Handle timeout when a user found a game
    const [findTime, setFindTime] = React.useState<Date>();
    const [isTimeOut, setIsTimeOut] = React.useState<boolean>(false);

    React.useEffect(() => {
        setFindTime(new Date());
        // TO DO: DO A TIMEOUT IN THE SERVER TOO !!!
        const wrappedReadyButton : JSX.Element =
        <div>
            <ButtonPong
                content="Accept"
                divClassName=""
                buttonClassName=""
                onClickHandler={acceptGame}
            />
            <ButtonPong
                content="Refuse"
                divClassName=""
                buttonClassName=""
                onClickHandler={cancelQueue}
            />
        </div>;
        setReadyButton(gameFound == true ? wrappedReadyButton : <></>);
    }, [gameFound]);

    // TO DO: Check all the time only when gameFound setter is trigered to true
    React.useEffect(() => {
        if (findTime && new Date().getSeconds() - findTime.getSeconds() >= 10)
        {
            setIsTimeOut(true);
            setFindTime(undefined);
        }
    });

    const [roomId, setRoomId] = React.useState<string>();

    context.socket.on(Mesages.RECEIVE_ROOM_ID, (id : string) => {
        setRoomId(id);
    });

    const acceptGame = () => {
        context.socket.emit(Mesages.PLAYER_IS_READY, context.gameId, context.playerId);

        // TO DO: await somehow the response

        // TO DO: Put both in a setInterval for a limited time or something like that
        // TO DO: Emit each N seconds
        context.socket.emit(Mesages.ARE_PLAYERS_READY, context.gameId);

        // TO DO: Check each N seconds, if timeout cancel game
        if (isTimeOut == false && allReady)
            context.goToPongGame();
        else
            cancelQueue();
    };

    const findGame = () => {
        setInQueue(true);
        context.socket.emit(Mesages.FIND_GAME, context.playerId);
        
        // TO DO: Somehow wait to receive the roomId before exec this
        while (inQueue == true) ; // wait ? in aync ?
        context.socket.emit(Mesages.IS_IN_QUEUE, roomId, context.playerId);
    };

    const cancelQueue = () => {
        setInQueue(false);
        setGameFound(false);
        setIsTimeOut(false);
        context.socket.emit(Mesages.PLAYER_ISNT_READY, context.gameId, context.playerId);
        context.socket.emit(Mesages.CANCEL_QUEUE, context.playerId, context.gameId);
    };

    return (
        <>
            <div className="">
                <Text
                    content="*** DEFAULT GAME (IN FAST GAME) BRIEF ***\n"
                    divClassName=""
                    textClassName=""
                />
                {timer}
                {readyButton}
                <div className="">
                    <ButtonPong
                        content="Find Game"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={findGame}
                        disabled={inQueue == false ? undefined : true}
                    />
                    <ButtonPong
                        content="Cancel"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={cancelQueue}
                        disabled={inQueue == false ? true : undefined}
                    />
                </div>
            <ButtonPong
                content="Quit"
                divClassName=""
                buttonClassName=""
                onClickHandler={() => context.goToSelection()}
            />
            </div>
        </>
    );
}
