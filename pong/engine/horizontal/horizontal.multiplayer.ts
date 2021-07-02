import {
    Vector2D
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
import {
    PongSocketServer
} from "../../server/socketserver"
import AHorizontalLib from "./horizontal"

export default class HorizontalMultiPlayerLib extends AHorizontalLib
{
    constructor(
        sockServ : PongSocketServer,
        gameConfig : IStaticDto,
        ballSpeedIncrement : number,
        mode : GameMode,
        level? : number
    ) { super(sockServ, gameConfig, ballSpeedIncrement, mode, level); }

    async updatePlayerTwoPos(status : IDynamicDto)
    {
        (status.playerTwo as Partial<Vector2D>) =
        await this.sockServ.getMousePosClient(this.gameConfig.playerTwo.id);
    }
}
