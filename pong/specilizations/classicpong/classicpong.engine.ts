import {
    GameMode
} from "../../../engine";
import {
    GameStatus
} from "../../game/status"
import {
    LIB_HORIZONTAL
} from "../../engine/lib.names"
import ClassicPongGameConfig from "./customization/classicpong.gameconfig"
import PongGenerator from "../../engine/engine"
import {
    Socket
} from "ngx-socket-io"

export default class ClassicPong extends PongGenerator
{
    constructor(
        idRoom : string,
        idPlayerOne : string,
        idPlayerTwo : string,
        socket : Socket
    )
    {
        super(
            new ClassicPongGameConfig(idPlayerOne, idPlayerTwo),
            socket,
            idRoom
        );
    }
}
