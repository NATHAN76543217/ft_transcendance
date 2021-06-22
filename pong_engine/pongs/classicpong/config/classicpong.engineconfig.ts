import {
    AEngineConfig,
    GameMode,
    PosUpdaterEvent
} from "../../../engine"
import {
    GameConfig,
    ABall,
    Player
} from "../../../game_objs"
import {
    pongBotHorizontal,
    isBallOnLeftCourtSideHorizontal,
    calcPaddleReboundRadHorizontal,
    changeBallDirHorizontal
} from "../../../utils"

export default class ClassicPongEngineConfig extends AEngineConfig
{
    constructor(
        gameMode : GameMode,
        botlevel : number,
        ballSpeedIncrement : number
    )
    {
        // TO DO: Player Pos Updaters
        super(gameMode, botlevel, ballSpeedIncrement, null // TODO: REMOVE 'null'
        // gameMode == GameMode.SINGLEPLAYER
        // ? pongBotHorizontal
        // : "TO DO PLAYER 2 MOUSE POS"
        );
    }

    updatePlayer1Pos(gameConfig : GameConfig, event : PosUpdaterEvent) : void
    {
        // Some functions that get the users pos in the front
    }

    isBallOnPlayer1Side(gameConfig : GameConfig) : boolean
    { return isBallOnLeftCourtSideHorizontal(gameConfig); }

    getPaddleReboundRad(ball : ABall, player : Player) : number
    { return calcPaddleReboundRadHorizontal(ball, player); }

    changeBallDirection(gameConfig : GameConfig, angle : number) : void
    { return changeBallDirHorizontal(gameConfig, angle); }
}