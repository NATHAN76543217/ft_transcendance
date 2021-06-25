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
import {
    PongSocketServer
} from "../../../sockerServer"

export default class ClassicPongEngineConfig extends AEngineConfig
{
    constructor(
        server : PongSocketServer,
        gameMode : GameMode,
        botlevel : number,
        ballSpeedIncrement : number
    )
    {
        // TO DO: Have to make sure that the server is a singleton
        super(
            server,
            gameMode, 
            botlevel,
            ballSpeedIncrement,
        gameMode == GameMode.SINGLEPLAYER
        ? Player.pongBotHorizontal
        : Player.updatePlayerPosHorizontal
        );
    }

    async updatePlayerOnePos(playerOne : Player)
    { Player.updatePlayerPosHorizontal(playerOne, this.server); }

    isBallOnPlayer1Side(gameConfig : GameConfig) : boolean
    { return ACourt.isBallOnLeftSideHorizontal(gameConfig); }

    getPaddleReboundRad(ball : ABall, player : Player) : number
    { return Player.calcPaddleReboundRadHorizontal(ball, player); }

    changeBallDirection(gameConfig : GameConfig, angle : number) : void
    { return ABall.changeDirHorizontal(gameConfig, angle); }
}