import React from "react"

import SelectGameStyle from "./pages/gameType"
import GameCustom from "./pages/gameCustom"
import GameFast from "./pages/gameFast"
import InvitedToGame from "./pages/invited"
import Pong from "./pages/pong"
import PongGenerator from "../../../../../../pong/engine/engine"
import  ClassicPong from "../../../../../../pong/specilizations/classicpong/classicpong.engine"
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"


enum Pages {
    SELECT_GAME_STYLE,
    FAST_GAME,
    CUSTOM_GAME,
    INVITED,
    PONG,
}

export type IPongContext = {
    goToFastGame : Readonly<Function>;
    goToCustomGame : Readonly<Function>;
    goToSelection : Readonly<Function>;
    goToPongGame : Readonly<Function>;
    gameId : Readonly<string>;
    setGameId : React.Dispatch<React.SetStateAction<string>>; // Perhabs not need this one (cause gameId != React.Elem)
    playerId : string;
    socket : Socket;
    pongSpetializations : Readonly<Array<[string, PongGenerator]>>;
    pongIndex : Readonly<number>;
    setPongIndex : React.Dispatch<React.SetStateAction<number>>;
}

export const PongContext = React.createContext({
    goToFastGame: Function(),
    goToCustomGame : Function(),
    goToSelection: Function(),
    goToPongGame: Function(),
    gameId: String(),
    setGameId: Function(),
    playerId: String(),
    socket: { },
    pongSpetializations: Array(),
    pongIndex: Number(),
    setPongIndex: Function()
}  as unknown as IPongContext);

type IPongIndexProps = {
    playerId : string;
    isInvited? : true;
    roomId? : string;
}

export function PongIndex({
    playerId,
    isInvited,
    roomId
} : IPongIndexProps)
{
    // Handle pages changes
    const [currentPage, setCurrentPage] = React.useState<Pages>(isInvited ? Pages.INVITED : Pages.SELECT_GAME_STYLE);
    const goToFastGame : Readonly<Function> = () => { setCurrentPage(Pages.FAST_GAME); };
    const goToCustomGame : Readonly<Function> = () => { setCurrentPage(Pages.CUSTOM_GAME); };
    const goToSelection : Readonly<Function> = () => { setCurrentPage(Pages.SELECT_GAME_STYLE); };
    const goToPongGame : Readonly<Function> = () => { setCurrentPage(Pages.PONG); };

    let pageJSX : JSX.Element = <></>;

    React.useEffect(() => {

        switch (currentPage)
        {
            case Pages.SELECT_GAME_STYLE:
                pageJSX = <SelectGameStyle />;
                break ;
            case Pages.FAST_GAME:
                pageJSX = <GameFast />;
                break ;
            case Pages.CUSTOM_GAME:
                pageJSX = <>{/* TO DO */}</>;
                break ;
            case Pages.PONG:
                pageJSX = <Pong canvasId="pongCanvas"/>;
                break ;
            case Pages.INVITED:
                pageJSX = <InvitedToGame />;
                break ;
            default:
                throw new Error(); // Unspected error
        }
    }, [currentPage])

    // Handle game/room id
    const [gameId, setGameId] = React.useState<string>(roomId ? roomId : "not in game yet");
    const socket : Socket = new Socket({
        url: "http://localhost",
        options: { }
    } as SocketIoConfig);

    // Handle pong spetializations
    const [pongIndex, setPongIndex] = React.useState<number>(0);
    const pongSpetializations : Array<[string, PongGenerator]> = [
        [
            "Classic Pong",
            new ClassicPong(
                roomId ? roomId : playerId, // If room id is playerOne's id
                playerId,
                String(),
                socket
            )
        ],
    ];

    return (
        <>
            <PongContext.Provider value={{
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
            }}>
                {pageJSX}
            </PongContext.Provider>
        </>
    );
}
