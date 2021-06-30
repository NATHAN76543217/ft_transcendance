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

declare interface RoomDto
{
    idRoom : number;
    idPlayerOne : string;
    idPlayerTwo : string;
    config : IStaticDto;
}

declare interface MousePosDto
{
    x : number;
    y : number;
}

@WebSocketGateway()
export class PongSocketServer implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server;
    public rooms : Map <number, RoomDto> // Map< roomId, RoomPlayersIds >
    public mousesPos : Map<string, MousePosDto>; // Map< playerId, mousePos >

    // TO DO: Warnign circular reference that trick garbage collector to never free objects !!!
    // PongSocketServer <-> APolimorphicLib
    constructor(
        public calcLib : APolimorphicLib
    )
    { }

    @SubscribeMessage('onConnextion')
    async handleConnection(room : RoomDto)
    { this.rooms[room.idRoom] = room; }

    @SubscribeMessage('onDisconextion')
    async handleDisconnect(room : RoomDto)
    {
        this.rooms.delete(room.idRoom);
        this.mousesPos.delete(room.idPlayerOne);
        this.mousesPos.delete(room.idPlayerTwo);
    }

    @SubscribeMessage('calcGameStatus')
    async calcPongStatus(status : IDynamicDto)
    { return calcGameStatus(status, this.calcLib); }

    @SubscribeMessage('mouseEvent')
    async updateMousePosClient(id : string, mousePos : MousePosDto)
    { this.mousesPos[id] = mousePos; }

    // TO DO: Should i use Promises ?
    async getMousePosClient(id : string) : Promise<MousePosDto>
    { return this.mousesPos[id]; }
}