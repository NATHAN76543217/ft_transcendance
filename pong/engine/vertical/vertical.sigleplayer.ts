import {
    IVector2D
} from "../../shapes/vector2d"
import {
    GameMode
} from "../polimorphiclib"
import {
    IStaticDto
} from "../../dto/static.dto"
import {
    IDynamicDto
} from "../../dto/dynamic.dto"
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