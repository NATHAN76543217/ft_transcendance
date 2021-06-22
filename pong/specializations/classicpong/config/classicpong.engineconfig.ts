import {
    AEngineConfig,
    GameMode,
    PosUpdaterEvent
} from "../../../engine"
import {
    GameConfig,
    ABall,
    Player,
    ACourt
} from "../../../game_objs"

export default class ClassicPongEngineConfig extends AEngineConfig
{
    constructor(
        gameMode : GameMode,
        botlevel : number,
        ballSpeedIncrement : number
    )
    {
        // TO DO: Player Pos Updaters
        super(gameMode, botlevel, ballSpeedIncrement,
        gameMode == GameMode.SINGLEPLAYER
        ? Player.pongBotHorizontal
        : null // TO DO: Change null by the multiplayer handler
        );
    }

    updatePlayer1Pos(gameConfig : GameConfig, event : PosUpdaterEvent) : void
    {
        // Use some function that get the users pos in the front
    }

    isBallOnPlayer1Side(gameConfig : GameConfig) : boolean
    { return ACourt.isBallOnLeftSideHorizontal(gameConfig); }

    getPaddleReboundRad(ball : ABall, player : Player) : number
    { return Player.calcPaddleReboundRadHorizontal(ball, player); }

    changeBallDirection(gameConfig : GameConfig, angle : number) : void
    { return ABall.changeDirHorizontal(gameConfig, angle); }
}