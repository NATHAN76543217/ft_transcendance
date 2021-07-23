
// TO DO: import shared from module

import {
    GameStatus
} from "../../game/status"

import ClassicPongGameConfig from "./customization/classicpong.gameconfig"
import PongClient from "../../engine/engine"
import SettingsLimits from "../classicpong/customization/classicpong.settings"
import {
    Socket
} from "socket.io-client"

// TO DO: Move to the front after fix server issue

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
