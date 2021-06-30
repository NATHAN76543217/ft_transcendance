import {
    GameMode
} from "../../../engine";
import {
    GameStatus
} from "../../game/status"
import {
    LIB_HORIZONTAL
} from "../../engine/lib.names"
import {
    Socket
} from "ngx-socket-io"
import ClassicPongGameConfig from "./customization/classicpong.gameconfig"
import PongGenerator from "../../engine/engine"

const CALCULATION_LIB = LIB_HORIZONTAL;

export default class ClassicPong extends PongGenerator
{
    constructor(
        idRoom : number,
        idPlayerOne : string,
        idPlayerTwo : string,
        socket : Socket
    )
    {
        super(
            new ClassicPongGameConfig(idPlayerOne, idPlayerTwo),
            CALCULATION_LIB,
            socket,
            idRoom
        );
    }
}
