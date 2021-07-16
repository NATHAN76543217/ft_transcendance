import React from "react"

import {
    PongContext
} from "../indexPong"
import {
    Mesages
} from "../../../../../../../pong/server/socketserver"


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
        context.socket.emit(Mesages.SEND_MOUSE_POS, {
            mousePosX: event.clientX,
            mousePosY: event.clientY,
        })
    });

    context.pongSpetializations[context.pongIndex][1].run();

    // TO DO: How to end the game ?
    // TO DO: Change run method from the engine

    return (
        <>
            <canvas id={canvasId} className="bg-black w-50 h-40" />
        </>
    );
}
