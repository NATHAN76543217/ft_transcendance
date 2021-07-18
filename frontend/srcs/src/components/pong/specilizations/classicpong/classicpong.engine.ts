
// TO DO: import shared from module

import {
    GameStatus
} from "../../../../../../../shared/pong/game/status"

import ClassicPongGameConfig from "./customization/classicpong.gameconfig"
import PongClient from "../../engine/engine"
import SettingsLimits from "../classicpong/customization/classicpong.settings"
import {
    Socket
} from "ngx-socket-io"

export default class ClassicPong extends PongClient
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
            new SettingsLimits(),
            socket,
            idRoom
        );
    }
}
