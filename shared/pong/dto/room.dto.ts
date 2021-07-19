import {
    IStaticDto
} from "./static.dto"
import {
    GameMode
} from "../utils/gamemode"
import {
    ICustomGame
} from "./customgame.dto"
import LibNames from "../utils/lib.names"

export interface IRoomDto
{
    isFilled : boolean;
    idRoom : string;
    idPlayerOne : string;
    idPlayerTwo : string;
    config : IStaticDto;
    libName : LibNames;
    mode : GameMode;
    customization : ICustomGame; // TO DO: I can remove this
    info : ICustomGame; // I prefer "customization" over "info" if i only need 1
    flags : number;
    level? : number;
}
