import React from "react"

import SelectGameStyle from "./pages/gameType"
import GameCustom from "./pages/gameCustom"
import GameFast from "./pages/gameFast"
import InvitedToGame from "./pages/invited"
import Pong from "./pages/pong"
import Spectator from "./pages/spectator"
import PongClient from "../engine/client"
import  ClassicPong from "../engine/classicpong.engine"
import Unspected from "shared-pong/game/exceptions/unspected.exception"
import {
    Socket,
    io
} from "socket.io-client"

enum Pages {
    SELECT_GAME_STYLE,
    FAST_GAME,
    CUSTOM_GAME,
    INVITED,
    PONG,
    SPECTATOR
}

export type IPongContext = {
    goToFastGame : Function;
    goToCustomGame : Function;
    goToSelection : Function;
    goToPongGame : Function;
    gameId : Readonly<string>;
    setGameId : React.Dispatch<React.SetStateAction<string>>; // Perhabs not need this one (cause gameId != React.Elem)
    playerId : string;
    socket : Socket;
    pongSpetializations : Readonly<Array<[string, PongClient]>>;
    pongIndex : Readonly<number>;
    setPongIndex : React.Dispatch<React.SetStateAction<number>>;
}

export const PongContext = React.createContext<IPongContext>({
    goToFastGame: Function(),
    goToCustomGame : Function(),
    goToSelection: Function(),
    goToPongGame: Function(),
    gameId: String(),
    setGameId: () => { },
    playerId: String(),
    socket: { } as Socket,
    pongSpetializations: Array(),
    pongIndex: Number(),
    setPongIndex: () => { }
});

export enum PlayerRole {
    HOST,
    INVITED,
    SPECTATOR,
}

type IPongIndexProps = {
    playerId : string;
    role : PlayerRole;
    roomId? : string;
}

function getFirstPage(role : PlayerRole) : Pages
{
    switch (role)
    {
        case PlayerRole.HOST:
            return Pages.SELECT_GAME_STYLE;
        case PlayerRole.INVITED:
            return Pages.INVITED;
        case PlayerRole.SPECTATOR:
            return Pages.SPECTATOR;
        default:
            throw new Unspected("Unspected error on getFirstPage");
    }
}

export default function PongIndex({
    playerId,
    role,
    roomId
} : IPongIndexProps)
{

    // TO DO: TO I USE playerId as or the socket.id (i think is better player id)

    // Handle pages changes
    const [currentPage, setCurrentPage] = React.useState<Pages>(getFirstPage(role));
    const goToFastGame : Function = () => { setCurrentPage(Pages.FAST_GAME); };
    const goToCustomGame : Function = () => { setCurrentPage(Pages.CUSTOM_GAME); };
    const goToSelection : Function = () => { setCurrentPage(Pages.SELECT_GAME_STYLE); };
    const goToPongGame : Function = () => { setCurrentPage(Pages.PONG); };

    const [pageJSX, setPageJSX] = React.useState<JSX.Element>(<></>);

    React.useEffect(() => {
        switch (currentPage)
        {
            case Pages.SELECT_GAME_STYLE:
                setPageJSX(<SelectGameStyle />);
                break ;
            case Pages.FAST_GAME:
                setPageJSX(<GameFast />);
                break ;
            case Pages.CUSTOM_GAME:
                setPageJSX(<GameCustom />);
                break ;
            case Pages.PONG:
                setPageJSX(<Pong canvasId="pongCanvas" />);
                break ;
            case Pages.INVITED:
                setPageJSX(<InvitedToGame />);
                break ;
            case Pages.SPECTATOR:
                setPageJSX(<Spectator />);
                break ;
            default:
                throw new Unspected("Unspected error on: useEffects from indexPong.tsx");
        }
    }, [currentPage]);

    // Handle game/room id
    const [gameId, setGameId] = React.useState<string>(roomId ? roomId : "not in game yet");
    const socket : Socket = io();

    // Handle pong spetializations
    const [pongIndex, setPongIndex] = React.useState<number>(0);
    const pongSpetializations : Array<[string, PongClient]> = [
        [
            "Classic Pong",
            new ClassicPong(
                role != PlayerRole.HOST && roomId ? roomId : socket.id,
                String(),
                String(),
                socket
            )
        ],
    ];

    const context : IPongContext = {
        goToFastGame: goToFastGame,
        goToCustomGame: goToCustomGame,
        goToSelection: goToSelection,
        goToPongGame: goToPongGame,
        gameId: gameId,
        setGameId: setGameId,
        playerId: playerId,
        socket: socket,
        pongSpetializations: pongSpetializations,
        pongIndex: pongIndex,
        setPongIndex: setPongIndex
    };

    return (
        <>
            <PongContext.Provider value={{...context}}>
                {pageJSX}
            </PongContext.Provider>
        </>
    );
}
