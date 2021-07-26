import ClassicPongGameConfig from "shared-pong/specilizations/classicpong/customization/classicpong.gameconfig"
import PongClient from "../engine/client"
import SettingsLimits from "shared-pong/specilizations/classicpong/customization/classicpong.settings"
import {
    Socket
} from "socket.io-client"

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
