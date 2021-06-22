import {
    Engine,
    GameMode
} from "../../engine"

import ClassicPongGameConfig from "./config/classicpong.gameconfig"
import ClassicPongEngineConfig from "./config/classicpong.engineconfig"
import ClassicPongSettingsConfig from "./config/classicpong.settingsconfig"

const BALL_SPEED_INCREMENT : number = 1;

export default class ClassicPong extends Engine
{
    constructor(
        gameMode : GameMode,
        botlevel? : number,
    )
    {
        super(
            new ClassicPongGameConfig(),
            new ClassicPongSettingsConfig(),
            new ClassicPongEngineConfig(gameMode, botlevel ? botlevel : 1, BALL_SPEED_INCREMENT)
        )
    }
}
