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

    // True if the client is searching for game
    const [isInQueue, setIsInQueue] = React.useState<boolean>(false);

    // Can be a timer, an accept/reject button or empty
    const [elem, setElem]  = React.useState<JSX.Element>(<> </>);

    // State of child component Timer
    const [inQueueTime, setInQueueTime] = React.useState<number>(0);

    // Backup of Timer state
    const [prevInQueueTime, setPrevInQueueTime] = React.useState<number>(0);

    // True if the user clicked on accept button (used for handle timeout)
    const [onAcceptClick, setOnAcceptClick] = React.useState<boolean>(false);

    // True if buttons "Find Match" & "Cancel" should be disabled
    const [disableButtons, setDisableButtons] = React.useState<boolean>(false);

    /////////////////////////////
    // BUTTON ONCLICK HANDLERS //
    /////////////////////////////

    // Handler for "Find Match" button
    const onFindMatch = () => {
        setIsInQueue(true);
        context.socket.emit(Mesages.FIND_GAME, context.playerId);
    };

    // Handler for "Cancel" button
    const onCancelSearch = () => {
        context.socket.emit(Mesages.CANCEL_QUEUE, context.playerId,
            (response : {res : boolean}) => {
                if (response.res == true)
                    setIsInQueue(false);
                else
                    throw new Error(); // TO DO: Error durring queue cancelation
            }
        );
        setInQueueTime(0);
        setPrevInQueueTime(0);
    };

    // Handler for "Accept" button
    const onAccept = () => {
        setOnAcceptClick(true);
        context.socket.emit(Mesages.ACCEPT_MATCH, context.gameId, context.playerId);
    };

    // Handler for "Reject" button
    const onReject = () => {
        setOnAcceptClick(false);
        context.socket.emit(Mesages.DECLINE_MATCH, context.gameId, context.playerId);
        onCancelSearch();
    };

    ////////////////////////////
    // SOCKET EVENT LISTENERS //
    ////////////////////////////

    // Handler for FIND_GAME's response listener
    const onMatchFound = (roomId : string) => {
        setElem(
            <div>
                <ButtonPong
                content="Accept"
                divClassName=""
                buttonClassName=""
                onClickHandler={onAccept}
            />
            <ButtonPong
                content="Reject"
                divClassName=""
                buttonClassName=""
                onClickHandler={onReject}
            />
            </div>
        );

        context.setGameId(roomId);
        setPrevInQueueTime(inQueueTime);

        const seconds : number = 10;

        setTimeout(() => {
            if (onAcceptClick == false)
                onReject();
        }, 1000 * seconds)
    };

    // Handler for ACCEPT_MATCH's / DECLINE_MATCH's response listener
    const onReadyResponse = (response : boolean) => {
        if (response == true)
            context.goToPongGame();
        else
            setInQueueTime(prevInQueueTime);
    };

    // Unsubcribe all listeners
    const deleteListeners = () => {
        context.socket.off(Mesages.MATCH_FOUND_RESPONSE, onMatchFound);
        context.socket.off(Mesages.ON_READY_RESPONSE, onReadyResponse);
    };

    // Subscribe on the listeners, then on destruction unsubscribe them
    React.useEffect(() => {
        context.socket.on(Mesages.MATCH_FOUND_RESPONSE, onMatchFound);
        context.socket.on(Mesages.ON_READY_RESPONSE, onReadyResponse);

        return deleteListeners;
    }, []);

    ///////////////////////////
    // REACT EVENT LISTENERS //
    ///////////////////////////

    // Add a timer to the queue (while finding a game)
    React.useEffect(() => {
        const findingGame : string = "Finding Game ...\nTime: ";
        setElem(isInQueue
            ? <Timer
                value={inQueueTime}
                setValue={setInQueueTime}
                prefix={findingGame}
            />
            : <> </>
        );
    }, [isInQueue]);

    return (
        <>
            <div className="">
                <Text
                    content="*** DEFAULT GAME (IN FAST GAME) BRIEF ***\n"
                    divClassName=""
                    textClassName=""
                />
                <div className="">
                    {elem}
                </div>
                <div className="">
                    <ButtonPong
                        content="Find Match"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onFindMatch}
                        disabled={disableButtons == false && isInQueue == false ? undefined : true}
                    />
                    <ButtonPong
                        content="Cancel"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onCancelSearch}
                        disabled={disableButtons == true || isInQueue == false ? true : undefined}
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
