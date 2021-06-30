import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import {
    IDynamicDto
} from "../dto/dynamic.dto"
import {
    IStaticDto
} from "../dto/static.dto"
import {
    APolimorphicLib
} from "../engine/polimorphiclib"
import calcGameStatus from "../engine/calculations"
import {
    GameMode
} from "../engine/polimorphiclib"

declare interface LibPair<T extends APolimorphicLib>
{
    [key : string] : T
}

declare interface IRoomDto
{
    idRoom : number;
    idPlayerOne : string;
    idPlayerTwo : string;
    config : IStaticDto;
    libName : string;
    mode : GameMode;
    level? : number;
}

declare interface IMousePosDto
{
    x : number;
    y : number;
}

@WebSocketGateway()
export class PongSocketServer implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server;
    public rooms : Map <number, IRoomDto> // Map< roomId, RoomPlayersIds >
    public mousesPos : Map<string, IMousePosDto> // Map< playerId, mousePos >
    public libs : Map<string, APolimorphicLib> = {
        // TO DO: INIT THE MAP
        // TO DO: Think about single player multiplayer
        // Map of map ?
    }

    // TO DO: Warning circular reference that trick garbage collector to never free objects !!!
    // PongSocketServer <-> APolimorphicLib
    
    @SubscribeMessage('onConnexion')
    async handleConnection(room : IRoomDto)
    {
        if (this.rooms[room.idRoom])
        {
            this.rooms[room.idRoom] = room;
            
        }         
    }

    @SubscribeMessage('onDisconnexion')
    async handleDisconnect(room : IRoomDto)
    {
        this.rooms.delete(room.idRoom);
        this.mousesPos.delete(room.idPlayerOne);
        this.mousesPos.delete(room.idPlayerTwo);
    }

    @SubscribeMessage('calcGameStatus')
    async calcPongStatus(keyOfLibs : string, status : IDynamicDto)
    { return calcGameStatus(status, this.libs[keyOfLibs]); }

    @SubscribeMessage('mouseEvent')
    async updateMousePosClient(id : string, mousePos : IMousePosDto)
    { this.mousesPos[id] = mousePos; }

    // TO DO: Should i use Promises ?
    async getMousePosClient(id : string) : Promise<IMousePosDto>
    { return this.mousesPos[id]; }
}