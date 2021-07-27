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

    // TODO: An a condition for only subscribe players not spectators
    canvas?.addEventListener("mousemove", (event : any) => {
        context.socket.volatile.emit(Mesages.SEND_MOUSE_POS, {
            x: event.clientX,
            y: event.clientY,
        } as IMousePosDto)
    });

    context.pongSpetializations[context.pongIndex][1].run();

    // TO DO: How to end the game ?
    // TO DO: Redirect path to matches/current/gameId

    return (
        <>
            <canvas id={canvasId} className="bg-black w-50 h-40" />
        </>
    );
}
