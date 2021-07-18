
// TO DO: import module
import {
    Vector2D
} from "../../../../../../shared/pong/shapes/vector2d"
import {
    GameMode
} from "../../../../../../shared/pong/utils/gamemode"
import {
    IStaticDto
} from "../../../../../../shared/pong/dto/static.dto"
import {
    IDynamicDto
} from "../../../../../../shared/pong/dto/dynamic.dto"
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
