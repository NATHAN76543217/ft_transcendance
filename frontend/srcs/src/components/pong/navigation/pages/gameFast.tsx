import React from "react"

import ButtonPong from "../../components/button";
import Text from "../../components/text"
import {
    PongContext
} from "../indexPong"
import {
    Mesages
} from "../../../../../../../pong/server/socketserver"

export default function GameFast()
{
    const context = React.useContext(PongContext);

    // TO DO: Add a button for find game
    // TO DO: Read all the code and think about it

    const findGame = () => {
        // Should this be async ?
        const roomId : string = context.socket.emit(Mesages.FIND_GAME, context.playerId);

        while (context.socket.emit(Mesages.IS_IN_QUEUE, "", "") == false)
            ;
        context.goToPongGame()
    };

    const cancelQueue = () => {
        context.socket.emit(Mesages.CANCEL_QUEUE, context.playerId, context.gameId);
        context.goToSelection();
    };

    return (
        <>
            <div className="">
                <Text
                    content="In queue ..."
                    divClassName=""
                    textClassName=""
                />
                <ButtonPong
                    content="Cancel"
                    divClassName=""
                    buttonClassName=""
                    onClickHandler={cancelQueue}
                />
            </div>
        </>
    );
}
