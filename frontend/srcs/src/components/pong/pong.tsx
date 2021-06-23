export default function Pong(){
    return (
        <canvas id="pongCanvas" className="bg-black w-50 h-40">

        </canvas>
    );
}

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
*/