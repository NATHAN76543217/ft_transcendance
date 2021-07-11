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
import {
    randomBytes
} from "crypto"
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
import {
    LIB_VERTICAL_SINGLE,
    LIB_VERTICAL_MULTI,
    LIB_HORIZONTAL_SINGLE,
    LIB_HORIZONTAL_MULTI
} from "../engine/lib.names"
import HorizontalSinglePlayerLib from "../engine/horizontal/horizontal.singleplayer"
import HorizontalMultiPlayerLib from "../engine/horizontal/horizontal.multiplayer"
import VerticalSinglePlayerLib from "../engine/vertical/vertical.sigleplayer"
import VerticalMultiPLayerLib from "../engine/vertical/vertical.multiplayer"
import RoomNotFound from "../exceptions/roomNotFound.exception"
import NeedMorePlayers from "../exceptions/needMorePlayers.exception"
import IsSamePlayer from "../exceptions/isSamePlayer.exception"
import RoomIsFull from "../exceptions/roomIsFull.exception"
import Unspected from "../exceptions/unspected.exception"

import MatchesService from "../matches.service"
import ClassicPongGameConfig from "../specilizations/classicpong/customization/classicpong.gameconfig"

export interface ICustomGame
{
    ballSpeed : number;
    ballColor : string;
    courtColor : string;
    netColor : string;
    playerOneWidth : number;
    playerOneHeight : number;
    playerOneColor : string;
    playerTwoWidth : number;
    playerTwoHeight : number;
    playerTwoColor : string;
    gameBrief? : string;
}

export declare interface IRoomDto
{
    isFilled : boolean;
    idRoom : string;
    idPlayerOne : string;
    idPlayerTwo : string;
    config : IStaticDto;
    lib : APolimorphicLib;
    libName : string;
    mode : GameMode;
    customization : ICustomGame;
    info : ICustomGame;
    flags : number;
    level? : number;
}

declare interface MousePosDto
{
    x : number;
    y : number;
}

function SellectLib(
    name : string,
    sockServ : PongSocketServer,
    gameConfig : IStaticDto,
    ballSpeedIncrememnt : number,
    mode : GameMode,
    level? : number
) : APolimorphicLib
{
    switch(name)
    {
        case LIB_HORIZONTAL_SINGLE:
            return new HorizontalSinglePlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LIB_HORIZONTAL_MULTI:
            return new HorizontalMultiPlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LIB_VERTICAL_SINGLE:
            return new VerticalSinglePlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LIB_VERTICAL_MULTI:
            return new VerticalMultiPLayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        default:
            throw new Unspected("server not able to select a calculation lib");
    }
}

const PLAYER_ONE_READY : number = 1 << 0;
const PLAYER_TWO_READY : number = 1 << 1;
const PLAYER_ONE_EXPORTED_CONFIG : number = 1 << 2;
const PLAYER_TWO_EXPORTED_CONFIG : number = 1 << 3;

@WebSocketGateway()
export class PongSocketServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    public server : Server;
    public rooms : Map <string, IRoomDto>; // Map< roomId, RoomPlayersIds >
    public mousesPos : Map<string, IMousePosDto>; // Map< playerId, mousePos >
    public queue : Array<{key: string, socket: Socket}>

    constructor(
        private readonly matchesServices : MatchesService
    )
    { }

    // TO DO: Think a join for spectators
    // TO DO: Call endGame in the client

    // TO DO: Spectator.tsx preload the engine
    // TO DO: Spectator.tsx -> indexPong.tsx -> pong.tsx

    // TO DO: leave game changes the ownser of the room
    // Makes intived player perform invitations in the room
    // This is complicate to handle, better destroy just the room
    // THINK ABOUT IT

<<<<<<< HEAD
    // TO DO: Add execptions

    // TO DO: Warnign circular reference that trick garbage collector to never free objects !!!
=======
    // TO DO: Warning circular reference that trick garbage collector to never free objects !!!
>>>>>>> pong: commit before rm old version
    // PongSocketServer <-> APolimorphicLib
    // Update: Normally Map.propotype.delete should solve this

    private getRoom(idRoom : string)
    {
        const room : IRoomDto = this.rooms[idRoom];

        if (room === undefined)
            throw new RoomNotFound(idRoom);
        return (room);
    }

    afterInit(server : Server)
    { console.log("DEBUG: Server is launched!"); }

    handleConnection(client : Socket)
    { console.log(`DEBUG: New incoming connexion: ${client.id}`); }

    // All socket related disconnexion is performed automatically ?
    handleDisconnexion(client : Socket)
    { console.log(`DEBUG: Disconnextion from: ${client.id}`); }

    @SubscribeMessage('createRoom')
    createRoom(client : Socket, roomData : IRoomDto)
    {
        const idRoom : string = roomData.idPlayerOne;

        roomData.idRoom = idRoom;

        // Define if the game can start
        roomData.isFilled = roomData.mode == GameMode.SINGLE_PLAYER;

        roomData.flags = 0;
        
        // Push the room
        this.rooms[idRoom] = roomData;
        client.join(idRoom);

        // Notify the client that the room was successfuly created
        client.to(idRoom).emit('room', `Player: ${roomData.idPlayerOne} has joined the room (${idRoom})`);

        return idRoom;
    }

    @SubscribeMessage('joinRoom')
    joinRoom(client : Socket, idRoom : string, idPlayerTwo : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        if (room.isFilled == true)
            throw new RoomIsFull();
        else if (room.idPlayerOne == idPlayerTwo)
            throw new IsSamePlayer(idPlayerTwo);
        else
        {
            // Add the second player data to the room
            room.idPlayerTwo = idPlayerTwo;

            // Now, the game can start
            room.isFilled = true;
            
            // Push the room
            this.rooms[idRoom] = room;
            client.join(idRoom);

            // Notify other members that a player has joined the room
            client.to(idRoom).emit('room', `Player: ${room.idPlayerTwo} has joined the room (${idRoom})`);
        }
    }

    @SubscribeMessage('launchGame')
    async launchGame(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        if (room.isFilled == false)
            throw new NeedMorePlayers();
        else
        {
            room.lib = SellectLib(
                room.libName,
                this,
                room.config,
                0.1, // TO DO: WTF IS THIS SHITY ARCH ?!?!?
                room.mode,
                room.level
            );

            this.mousesPos[room.idPlayerOne] = {};
            this.mousesPos[room.idPlayerTwo] = {};

            this.rooms[idRoom] = room;

            await this.matchesServices.createMatch({
                idMatch: idRoom,
                idPlayerOne: room.idPlayerOne,
                idPlaterTwo: room.idPlayerTwo,
                startTime: new Date()
            });
        }
    }

    @SubscribeMessage('updateConfig')
    updateConfig(client : Socket, idRoom : string, config : IStaticDto)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.config = config;
        this.rooms[idRoom] = room;
    }

    @SubscribeMessage('playerIsReady')
    playerIsReady(client : Socket, idRoom : string, idPlayer : string)
    {  
        const room : IRoomDto = this.getRoom(idRoom);

        room.flags |= room.idPlayerOne == idPlayer
            ? PLAYER_ONE_READY : PLAYER_TWO_READY;
    }

    @SubscribeMessage('playerIsNotReady')
    playerIsNotReady(client : Socket, idRoom : string, idPlayer : string)
    {
        const room : IRoomDto = this.getRoom(idRoom)

        room.flags &= room.idPlayerOne == idPlayer
            ? ~PLAYER_ONE_READY : ~PLAYER_TWO_READY;
    }

    @SubscribeMessage('arePlayersReady')
    arePlayersReady(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        return room.mode == GameMode.MULTI_PLAYER
            ? room.flags & PLAYER_ONE_READY
            && room.flags & PLAYER_TWO_READY
            : room.flags & PLAYER_ONE_READY;
    }

    @SubscribeMessage('findGame')
    findGame(client : Socket, idPlayer : string)
    {
        let idRoom : string = undefined;

        // Add to the client queue
        if (!(idPlayer in this.queue))
            this.queue.push({
                key: idPlayer,
                socket: client
            });
        
        // Once a room is filled, remove clients form the queue
        if (this.queue.length >= 2)
        {
            idRoom = this.createRoom(this.queue[0].socket, {
                isFilled: false,
                idRoom: null,
                idPlayerOne: this.queue[0].key,
                idPlayerTwo: null,
                config: new ClassicPongGameConfig(this.queue[0].key, null),
                lib: null,
                libName: LIB_HORIZONTAL_MULTI,
                customization: null,
                info: null,
                flags: 0,
                mode: GameMode.MULTI_PLAYER
            });
            this.joinRoom(this.queue[1].socket, idRoom, this.queue[1].key);

            const room : IRoomDto = this.getRoom(idRoom);
            room.config.playerTwo.id = this.queue[1].key;

            this.queue.splice(0, 2);

            this.launchGame(client, idRoom);


        }
        // TO DO: Some timeout that stops the queue
        //  usefull per exemple if there are only one 1 player online 
        //  (no game is possible)

        return (idRoom);
    }

    // NOTE: If idRoom param is filled the room already exists and both player joined it
    @SubscribeMessage('cancelQueue')
    cancelQueue(client : Socket, idPlayer : string, idRoom? : string)
    {
        if (idRoom !== undefined)
            this.queue.filter(room => room.key != idPlayer);
        else
        {
            // TO DO: A can let this or just if you joined a game you can't quit (you were to slow !)
            //this.leaveRoom(client, idRoom, idPlayer);
            // If i let this i shoud quit both clients and destroy the room
        }
    }

    @SubscribeMessage('isInQueue')
    isInQueue(client : Socket, idRoom : string, idPlayer : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        for (const i in this.queue)
            if (i == idPlayer)
                return (true);
        return (false);
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(client : Socket, idRoom : string, idPlayer : string)
    {
        // When a clients leaves a room

        const room : IRoomDto = this.getRoom(idRoom);

        // Leave the room
        client.leave(idRoom);

        // Notify it
        client.to(idRoom).emit('room', `Player ${idPlayer} has quit the room ${idRoom}`);

        // Destroy the room when is empty
        if (room.isFilled == false)
            this.destroyRoom(client, idRoom);
        else
        {
            room.isFilled = false;
    
            // If playerOne leaves, playerTwo become playerOne
            // And other clients can join as playerTwo
            if (idPlayer == room.idPlayerOne)
                room.idPlayerOne = room.idPlayerTwo;
            room.idPlayerTwo = undefined;
        }
    }

    // NOTE: Clients should be leave the room before call this
    @SubscribeMessage('destroyRoom')
    destroyRoom(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        // Remove the players to the mouse's pos listener map
        let deleted : boolean = this.mousesPos.delete(room.idPlayerOne);
        if (deleted)
            deleted = this.mousesPos.delete(room.idPlayerTwo);

        // Remove the room from the rooms map
        if (deleted)
            deleted = this.rooms.delete(idRoom);
        
        if (deleted == false)
            throw new Unspected("Standar lib: Map: failed to delete");
    }

    @SubscribeMessage('endGame')
    async endGame(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        await this.matchesServices.updateMatch(idRoom, {
            idMatch: idRoom,
            idPlayerOne: room.idPlayerOne,
            idPlayerTwo: room.idPlayerTwo,
            scorePlayerOne: room.config.playerOne.score,
            scorePlayerTwo: room.config.playerTwo.score,
            startTime: await this.matchesServices.getCurrentMatchesById(idRoom).startTime,
            endTime: new Date()
        });
    }

    @SubscribeMessage('setUpGameStyle')
    setUpGameStyle(client : Socket, idRoom : string, libName : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.libName = libName;
        this.rooms[idRoom] = room;
    }

    @SubscribeMessage('getGameStyle')
    getGameStyle(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        return room.libName;
    }

    @SubscribeMessage('calcGameStatus')
    calcPongStatus(client : Socket, idRoom : string, status : IDynamicDto)
    { return calcGameStatus(status, this.getRoom(idRoom).lib); }

    @SubscribeMessage('mouseEvent')
    updateMousePosClient(client : Socket, idPlayer : string, mousePos : IMousePosDto)
    {
        // Can only update if player has joined a match
        if (idPlayer in this.mousesPos)
            this.mousesPos[idPlayer] = mousePos;
    }

    getMousePosClient(idPlayer : string)
    { return this.mousesPos[idPlayer]; }

    @SubscribeMessage('exportCustomization')
    exportCustomization(client : Socket, idRoom : string, idPlayer : string, customization : ICustomGame)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        if (room.idPlayerOne == idPlayer)
        {
            const saveProp : string = room.customization.playerTwoColor;
            room.customization = customization;
            room.customization.playerTwoColor = saveProp;
            room.flags |= PLAYER_TWO_EXPORTED_CONFIG;
        }
        else if (room.idPlayerTwo == idPlayer)
        {
            room.customization.playerTwoColor = customization.playerTwoColor;
            room.flags |= PLAYER_TWO_EXPORTED_CONFIG;
        }
        else
            throw new Unspected("Unspected error on exportCustomization"); 

        this.rooms[idRoom] = room;
    }

    @SubscribeMessage('importCustomization')
    importCustomization(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        return room.flags & PLAYER_ONE_EXPORTED_CONFIG
            && room.flags & PLAYER_TWO_EXPORTED_CONFIG
            ? room.customization : null;
    }

    @SubscribeMessage('setUpBotLevel')
    setUpBotLevel(client : Socket, idRoom : string, botLevel : number)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.level = botLevel;
        this.rooms[idRoom] = room;
    }

    @SubscribeMessage('getOtherPlayerId')
    getOtherPlayerId(client : Socket, idRoom : string, playerId : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        if (room.idPlayerOne == playerId)
            return (room.idPlayerTwo);
        else if (room.idPlayerTwo == playerId)
            return (room.idPlayerOne);
        else
            throw new Unspected("Unspected error in socketserver: getOtherPlayerId");
    }

    @SubscribeMessage('updateInfo')
    updateSharedClientsData(client : Socket, idRoom : string, idPlayer : string, data : ICustomGame)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        if (idPlayer == room.idPlayerOne)
        {
            const rememberColor : string = room.info.playerTwoColor;
            room.info = data;
            room.info.playerTwoColor = rememberColor;
        }
        else if (idPlayer == room.idPlayerTwo)
            room.info.playerTwoColor = data.playerTwoColor;
        else
            throw new Unspected("Unspected error in updateSharedClientsData");
        this.rooms[idPlayer] = room;
        return (room.info);
    }
}
