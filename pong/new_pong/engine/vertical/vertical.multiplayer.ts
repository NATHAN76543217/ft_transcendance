import {
    IVector2D
} from "../../shapes/vector2d"
import {
    GameMode
} from "../polimorphiclib"
import {
    IStaticDto
} from "../../dto/static.dto";
import {
    IDynamicDto
} from "../../dto/dynamic.dto"
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