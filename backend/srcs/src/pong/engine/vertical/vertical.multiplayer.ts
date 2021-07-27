import {
    GameMode
} from "shared-pong/utils/gamemode"
import {
    IStaticDto
} from "shared-pong/dto/static.dto";
import {
    IDynamicDto
} from "shared-pong/dto/dynamic.dto"
import {
    PongSocketServer
} from "../../server/socketserver"
import AVerticalLib from "./vertical"

export default class HorizontalSinglePlayerLib extends AVerticalLib
{
    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    updatePlayerTwoPos(status : IDynamicDto)
    {
        // TO DO: Server
    }
}
