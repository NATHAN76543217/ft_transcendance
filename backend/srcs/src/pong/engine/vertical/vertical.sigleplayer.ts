import {
    GameMode
} from "shared-pong/utils/gamemode"
import {
    IStaticDto
} from "shared-pong/dto/static.dto"
import {
    IDynamicDto
} from "shared-pong/dto/dynamic.dto"
import AVerticalLib from "./vertical"
import {
    PongSocketServer
} from "../../server/socketserver"

export default class HorizontalSinglePlayerLib extends AVerticalLib
{
    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    updatePlayerTwoPos(status : IDynamicDto, level : number)
    {

    }
}
