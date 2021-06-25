import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'

declare interface RoomInstance
{
    idRoom : number;
    idPlayerOne : string;
    idPlayerTwo : string;
}

declare interface MousePosDto
{
    mousePosX : number;
    mousePosY : number;
}

@WebSocketGateway()
export class PongSocketServer implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server;
    public rooms : Map <number, RoomInstance> // Map< roomId, RoomPlayersIds >
    public mousesPos : Map<string, MousePosDto>; // Map< playerId, mousePos >

    async handleConnection(room : RoomInstance)
    { this.rooms[room.idRoom] = room; }

    async handleDisconnect(room : RoomInstance)
    {
        this.rooms.delete(room.idRoom);
        this.mousesPos.delete(room.idPlayerOne);
        this.mousesPos.delete(room.idPlayerTwo);
    }

    @SubscribeMessage('mouseEvent')
    async updateMousePosClient(id : string, mousePos : MousePosDto)
    { this.mousesPos[id] = mousePos; }

    async getMousePosClient(id : string)
    { return this.mousesPos[id]; }
}