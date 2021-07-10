import React from "react"

import PongGenerator from "../../../../../../../pong/engine/engine"

import {
    Socket,
} from "ngx-socket-io"

// export default function Pong(socketServ : Socket, pongEngine : PongGenerator)
// {
//     const socket : Socket = socketServ;

//     const canvas = document.getElementById("pongCanvas");

//     canvas?.addEventListener("mousemove", (event : any) => {
//         socket.emit('mouseEvent', {
//             mousePosX: event.clientX,
//             mousePosY: event.clientY,
//         })
//     });

//     // Canvas should call this
//     pongEngine.run();

//     return (
//         <canvas id="pongCanvas" className="bg-black w-50 h-40">

//         </canvas>
//     );
// }

export default class Pong extends React.Component
{
    constructor(
        props : Readonly<{}>,
        public socket : Socket,
        public pongEngine : PongGenerator
    )
    {
        super(props);

        const canvas = document.getElementById("pongCanvas");

        canvas?.addEventListener("mousemove", (event : any) => {
            socket.emit('mouseEvent', {
                mousePosX: event.clientX,
                mousePosY: event.clientY,
            })
        });

        pongEngine.run();

        // TO DO: How to end the game ?
        // TO DO: Change run method from the engine
    }

    public render()
    {
        return (
            <canvas id="pongCanvas" className="bg-black w-50 h-40" />
        );
    }
}
