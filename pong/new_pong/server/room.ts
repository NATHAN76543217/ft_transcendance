
// I parse: GameMode
// I parse: GameStyle
// I parse: ? Settings
import {
    Socket,
} from "ngx-socket-io"
import {
    GameMode
} from "../engine/polimorphiclib"
import PongClient from "../engine/engine"
import {
    GameStatus
} from "../game/status"
import {
    IRoomDto
} from "./socketserver"
import {
    IStaticDto
} from "../dto/static.dto"

const DEFAULT_GAME = null; // TO DO

export default class Room
{
    public idRoom : number
    public engine : PongClient
    public socket : Socket

    constructor(
        public readonly idPlayerOne : string,
        public libName : string,
        public mode : GameMode,
        public idPlayerTwo? : string,
        public level? : number,
        public config? : GameStatus
    )
    {
        if (config === undefined)
            this.config = DEFAULT_GAME;
        
        this.socket = null; // TO DO

        // generate an id
        
        // Durring the game, score is updated in the database
        // The setted up engine is obiouslly used for render the game
        // Redirectck back at the end
    }

    public join(playerTwoId : string)
    {
        this.idPlayerTwo = playerTwoId;
        this.engine = new PongClient(this.config, this.libName, null, this.idRoom); // TO DO: Raplace null by the socket
        this.socket.emit('onJoin', this.idRoom, playerTwoId);
        // Store room data in the database
        // Then both will be redirected to the game url
    }

    public quit()
    { this.socket.emit('onDisconnexion', this.idRoom); }
}
