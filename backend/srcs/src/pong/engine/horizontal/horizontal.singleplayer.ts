


// TO DO: import Module

import {
    GameMode
} from "../../../../../../shared/pong/utils/gamemode"
import {
    IStaticDto
} from "../../../../../../shared/pong/dto/static.dto"
import AHorizontalLib from "./horizontal"
import {
    IDynamicDto
} from "../../../../../../shared/pong/dto/dynamic.dto"
import {
    PongSocketServer
} from "../../server/socketserver"

export default class HorizontalSinglePlayerLib extends AHorizontalLib
{
    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    updatePlayerTwoPos(status : IDynamicDto, level? : number)
    {
        status.playerTwo.y += (status.ball.y
            - (status.playerTwo.y + this.gameConfig.playerTwo.height / 2)) * level;
    }   
}
