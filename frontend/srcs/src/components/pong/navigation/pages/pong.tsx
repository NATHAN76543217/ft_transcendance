import React from "react"

import {
    PongContext
} from "../indexPong"
import {
    Mesages
} from "shared-pong/utils/messages"
import {
    IMousePosDto
} from "shared-pong/dto/mousepos.dto"

type IPongProps = {
    canvasId : string
}

export default function Pong({
    canvasId
} : IPongProps)
{
    const context = React.useContext(PongContext);

    const canvas = document.getElementById(canvasId);

    canvas?.addEventListener("mousemove", (event : any) => {
        context.socket.volatile.emit(Mesages.SEND_MOUSE_POS, {
            x: event.clientX,
            y: event.clientY,
        } as IMousePosDto)
    });

    // TO DO: Function run won't work, have issues to solve there
    context.pongSpetializations[context.pongIndex][1].run();

    // TO DO: How to end the game ?
    // TO DO: Change run method from the engine
    // TO DO: Redirect path to matches/current/gameId

    return (
        <>
            <canvas id={canvasId} className="bg-black w-50 h-40" />
        </>
    );
}
