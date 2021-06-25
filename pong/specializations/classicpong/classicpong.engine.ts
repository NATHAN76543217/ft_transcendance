import {
    Engine,
    GameMode
} from "../../engine"
import {
    PongSocketServer
} from "../../sockerServer"

import ClassicPongGameConfig from "./config/classicpong.gameconfig"
import ClassicPongEngineConfig from "./config/classicpong.engineconfig"
import ClassicPongSettingsConfig from "./config/classicpong.settingsconfig"

const BALL_SPEED_INCREMENT : number = 1;

export default class ClassicPong extends Engine
{
    constructor(
        server : PongSocketServer,
        idPlayerOne : string,
        idPlayerTwo : string,
        gameMode : GameMode,
        botlevel? : number,
    )
    {
        super(
            new ClassicPongGameConfig(idPlayerOne, idPlayerTwo),
            new ClassicPongSettingsConfig(),
            new ClassicPongEngineConfig(server, gameMode, botlevel ? botlevel : 1, BALL_SPEED_INCREMENT)
        )
    }
}
