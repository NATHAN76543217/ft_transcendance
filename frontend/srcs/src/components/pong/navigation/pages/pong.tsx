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
    }

    public render()
    {
        return (
            <canvas id="pongCanvas" className="bg-black w-50 h-40" />
        );
    }
}

// Exemple with a form pages/user/userSearch.tsx

// 1 only socket
// 1 room per game
// client socket are in the room
// 

// TO DO: Responsive canvas
// Mouse pos scraper form the client

/*
- 1) Single Player, Multiplayer interface
    -> Parse this
- 2) Init selected GameMode with what was parsed
- 3) Push a Game to the database
- 4) Redirect user(s) to the page where the game is "streamed" form the server
- 5) In this page, parse position of the player mouse
- 6) When the game end redirect back the user(s)

NOTE: Step 1 is a post

// 6/07/2021

1) Make a form that init the game
2) Depends if is matchmaking or customizing mode -> The room is init
3) The room is joined (for not matchmaking)
4) The game can run -> {push game to the database}, {other players can join as spectators}
5) At the end "revenge" or "go back" -> {update score in the database and endtime}

// Set up a default game for matchmaking games ? Yes is easier.

*/
