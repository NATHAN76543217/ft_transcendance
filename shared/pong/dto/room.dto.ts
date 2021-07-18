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

export declare interface IRoomDto
{
    isFilled : boolean;
    idRoom : string;
    idPlayerOne : string;
    idPlayerTwo : string;
    config : IStaticDto;
    lib : APolimorphicLib; // Problem with this, define it 2 times ? (2nd time will extend the first one automatically)
    // One time in shared (here), another time in Server adding the lib
    libName : LibNames;
    mode : GameMode;
    customization : ICustomGame; // TO DO: I can remove this
    info : ICustomGame; // I prefer "customization" over "info" if i only need 1
    flags : number;
    level? : number;
}

// Merging problems:
// 1) /shared: room.dto.ts -> APolimorphic lib is in backend
// 2) /front: gameCustom on React code at <PongStyleSelectorContext.Provider> -> value need a cast in unknown (~ line 300)
// 3) /back: import a class from the front ... (~ line 47)
