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

    const [inQueue, setInQueue] = React.useState<boolean>(false);
    const [timer, setTimer] = React.useState<JSX.Element>(<></>);

    const findingGame : string = "Finding Game ...\nTime: ";

    React.useEffect(() => {
        if (inQueue == true)
            setTimer(<Timer prefix={findingGame}/>);
        else
            setTimer(<></>);
    }, [inQueue]);

    // TO DO: This won't work, i'm a 100% sure
    const findGame = () => {
        setInQueue(true);

        // Should this be async ?
        const roomId : string = context.socket.emit(Mesages.FIND_GAME, context.playerId);

        while (context.socket.emit(Mesages.IS_IN_QUEUE, roomId, context.playerId) == false)
            ;

        context.goToPongGame();
    };

    const cancelQueue = () => {
        setInQueue(false);
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
