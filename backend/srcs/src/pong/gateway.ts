import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import {
    Server,
    Socket
} from "socket.io"
import MatchesService from "../matches/matches.service"

export type IQueuePlayer = {
    key: number;
    value: Socket;
}

export interface IMousePos {
    x : number;
    y : number;
}

export enum ErrStatus {
    OK = "ok",
    ERROR = "not ok"
}

export interface IAcknowledgement {
    status : "ok" | "not ok";
}

// export interface IRoomDto {
//     roomId : number;
//     // key : userId, value : their mouse pos
//     players : Map<number, IMousePos>;
//     // TO DO: A game status ?
//     // TO DO: Add flags if needed
//     isFilled : boolean;
//     level? : number;
// }

export class RoomDto {
    public playerIds : number[];
    public playersMousePos : Map<number, IMousePos> = new Map();
    public filled : boolean = false;
    public level? : number;

    constructor(
        public id : number,
    )
    {
        this.addPlayer(id);
    }

    public getId()
    {
        return String(this.id);
    }

    public addPlayer(playerId : number)
    {
        this.playerIds.push(playerId);
    }

    public setMousePos(playerId : number, mousePos : IMousePos)
    {
        if (playerId in this.playerIds)
            this.playersMousePos.set(playerId, mousePos);
        else
            throw new Error(); // Unspected error
    }

    // public removeMousePos(playerId : number) // NOT NEED ?!?!?
    // {
    //     if (playerId in this.playerIds)
    //         this.playersMousePos.delete(playerId);
    //     else
    //         throw new Error(); // Unspected Error
    // }

    public setIsFilled(state : boolean)
    {
        this.filled = state;
    }

    public isFilled()
    {
        return this.filled;
    }
}

export enum ServerMessages {
    CREATE_ROOM = "server:createRoom",
    JOIN_ROOM = "server:joinRoom",
    PUSH_GAME = "server:pushGame",
    UPDATE_GAME = "server:updateGame",
    FIND_GAME = "server:findGame",
    CANCEL_FIND = "server:cancelFind",
}

export enum ClientMessages {
    NOTIFY = "client:notify",
    MATCH_FOUND = "client:matchFound",
}


@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    public server : Server;
    public rooms : Map<number, RoomDto>;
    public matchmakingQueue : IQueuePlayer[];

    constructor(
        private readonly matchesServices : MatchesService
    )
    { }

    afterInit(server : Server)
    { console.log("DEBUG: Server is launched!"); }

    handleConnection(client : Socket)
    { console.log(`DEBUG: New incoming connexion: ${client.id}`); }

    handleDisconnect(client : Socket)
    { console.log(`DEBUG: Disconnextion from: ${client.id}`); }

    private getRoom(key : number) {
        const room : RoomDto = this.rooms.get(key);

        if (room === undefined)
            throw new Error(); // Room not found
        return room;
    }

    private setRoom(room : RoomDto)
    {
        this.rooms.set(room.id, room);
    }

    @SubscribeMessage(ServerMessages.CREATE_ROOM)
    onCreateRoom(client : Socket, hostId : number) {

        const room : RoomDto = new RoomDto(hostId);
        this.setRoom(room);
        client.join(room.getId());
        client.in(room.getId()).emit(ClientMessages.NOTIFY, `Player with id ${hostId} has joined the room ${room.getId()}`);
    }

    @SubscribeMessage(ServerMessages.JOIN_ROOM)
    onJoinRoom(client : Socket, roomId : number, guestId : number)
    {
        const room : RoomDto = this.getRoom(roomId);
        // TO DO: Can check if the room is filled here or not: THINK ABOUT IT
        if (guestId in room.playerIds)
            throw new Error(); // User is already in the room
        room.addPlayer(guestId);
        this.setRoom(room);
        client.to(room.getId()).emit(ClientMessages.NOTIFY, `Player with id ${guestId} has joined the room ${room.getId()}`);
    }

    @SubscribeMessage(ServerMessages.PUSH_GAME)
    async onPushGame(client : Socket, roomId : number)
    {
        // TO DO: Can check if the room is filled here or not: THINK ABOUT IT

        const room : RoomDto = this.getRoom(roomId);
        
        // TO DO: Can be performed in a smarter way
        for (const playerId of room.playerIds)
            room.setMousePos(playerId, {} as IMousePos);

        this.setRoom(room);

        if (room.playerIds.length < 2)
            throw new Error(); // Unnecesary ... but better check anyways
        await this.matchesServices.createMatch({
            idMatch: room.getId(),
            idPlayerOne: room.playerIds[0].toString(),
            idPlayerTwo: room.playerIds[1].toString(),
            startTime: new Date()
        });
    }

    @SubscribeMessage(ServerMessages.UPDATE_GAME)
    async onUpdateGame(client : Socket, roomId : number)
    {
        const room : RoomDto = this.getRoom(roomId);

        const matchEntity = await this.matchesServices.getCurrentMatchesById(roomId.toString());
        await this.matchesServices.updateMatch(room.getId(), {
            idMatch: room.getId(), // Why is recurent ?
            idPlayerOne: room.playerIds[0].toString(),
            idPlayerTwo: room.playerIds[1].toString(),
            scorePlayerOne: 0, // TO DO: Get the score from somewhere
            scorePlayerTwo: 0, // TO DO: Get the score from somewhere
            startTime: matchEntity.startTime, // Change this
            endTime: new Date()
        });
    }

    @SubscribeMessage(ServerMessages.FIND_GAME)
    onFindGame(client : Socket, playerId : number)
    {
        if (!(playerId in this.matchmakingQueue))
        {
            this.matchmakingQueue.push({
                key: playerId,
                value: client
            });
        }

        if (this.matchmakingQueue.length >= 2)
        {
            const queueLenght : number = this.matchmakingQueue.length;
            const playerOne : IQueuePlayer = this.matchmakingQueue[queueLenght - 2];
            const roomId : number = playerOne.key;
            const playerTwo : IQueuePlayer = this.matchmakingQueue[queueLenght - 1];

            // NOTE: Just for debug
            if (playerOne.key !== playerId && playerTwo.key !== playerId)
                throw new Error();

            this.onCreateRoom(playerOne.value, playerOne.key);
            this.onJoinRoom(playerTwo.value, roomId, playerTwo.key);

            this.matchmakingQueue.splice(queueLenght - 2, 2);

            this.onPushGame(client, roomId);
        }
    }

    @SubscribeMessage(ServerMessages.CANCEL_FIND)
    onCancelFind(client : Socket, playerId : number, callback : (st: IAcknowledgement) => void)
    {
        let status : IAcknowledgement = {status: ErrStatus.OK};
        if (!(playerId in this.matchmakingQueue))
            status = {status: ErrStatus.ERROR};
        this.matchmakingQueue.filter(player => player.key != playerId);
        callback(status);
    }

    // TO DO: Implement in front & back: An engine using a state
    // TO DO: Implement in front: A renderizer to display the state
}
