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
    IDynamicDto
} from "shared-pong/dto/dynamic.dto"
import {
    IStaticDto
} from "shared-pong/dto/static.dto"
import {
    APolimorphicLib
} from "../engine/polimorphiclib"
import calcGameStatus from "../engine/calculations"
import {
    GameMode
} from "shared-pong/utils/gamemode"
import LibNames from "shared-pong/utils/lib.names"
import HorizontalSinglePlayerLib from "../engine/horizontal/horizontal.singleplayer"
import HorizontalMultiPlayerLib from "../engine/horizontal/horizontal.multiplayer"
import VerticalSinglePlayerLib from "../engine/vertical/vertical.sigleplayer"
import VerticalMultiPLayerLib from "../engine/vertical/vertical.multiplayer"
import RoomNotFound from "../exceptions/roomNotFound.exception"
import NeedMorePlayers from "../exceptions/needMorePlayers.exception"
import IsSamePlayer from "../exceptions/isSamePlayer.exception"
import RoomIsFull from "../exceptions/roomIsFull.exception"
import Unspected from "../exceptions/unspected.exception"
import MatchesService from "../../matches/matches.service"
import ClassicPongGameConfig from "shared-pong/specilizations/classicpong/customization/classicpong.gameconfig"
import {
    IRoomDto as IRoomDtobase
} from "shared-pong/dto/room.dto"
import {
    Mesages
} from "shared-pong/utils/messages"
import {
    ICustomGame
} from "shared-pong/dto/customgame.dto"
import {
    IMousePosDto
} from "shared-pong/dto/mousepos.dto"

interface IRoomDto extends IRoomDtobase
{
    lib : APolimorphicLib;
}

function SellectLib(
    name : LibNames,
    sockServ : PongSocketServer,
    gameConfig : IStaticDto,
    ballSpeedIncrememnt : number,
    mode : GameMode,
    level? : number
) : APolimorphicLib
{
    switch(name)
    {
        case LibNames.LIB_HORIZONTAL_SINGLE:
            return new HorizontalSinglePlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LibNames.LIB_HORIZONTAL_MULTI:
            return new HorizontalMultiPlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LibNames.LIB_VERTICAL_SINGLE:
            return new VerticalSinglePlayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        case LibNames.LIB_VERTICAL_MULTI:
            return new VerticalMultiPLayerLib(sockServ, gameConfig, ballSpeedIncrememnt, mode, level);
        default:
            throw new Unspected("server not able to select a calculation lib");
    }
}

enum State {
    PLAYER_ONE_READY = 1 << 0,
    PLAYER_TWO_READY = 1 << 1,
}

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

    // TO DO: Call endGame in the client

    // TO DO: leave game changes the owner of the room
    // Makes intived player perform invitations in the room
    // This is complicate to handle, better destroy just the room
    // THINK ABOUT IT

    // TO DO: Warning circular reference that trick garbage collector to never free objects !!!
    // PongSocketServer <-> APolimorphicLib
    // Update: Normally Map.propotype.delete should solve this

    private getRoom(idRoom : string)
    {
        const room : IRoomDto = this.rooms.get(idRoom);

        if (room === undefined)
            throw new RoomNotFound(idRoom);
        return (room);
    }

    afterInit(server : Server)
    { console.log("DEBUG: Server is launched!"); }

    handleConnection(client : Socket)
    { console.log(`DEBUG: New incoming connexion: ${client.id}`); }

    // All socket related disconnexion is performed automatically ?
    handleDisconnect(client : Socket)
    { console.log(`DEBUG: Disconnextion from: ${client.id}`); }

    @SubscribeMessage(Mesages.CREATE_ROOM)
    createRoom(client : Socket, roomData : IRoomDto)
    {
        const idRoom : string = roomData.idPlayerOne;

        roomData.idRoom = idRoom;

        // Define if the game can start
        roomData.isFilled = roomData.mode == GameMode.SINGLE_PLAYER;

        roomData.flags = 0;
        
        // Push the room
        this.rooms.set(idRoom, roomData);
        client.join(idRoom);

        // Notify the client that the room was successfuly created
        client.to(idRoom).emit('room', `Player: ${roomData.idPlayerOne} has joined the room (${idRoom})`);

        return idRoom;
    }

    @SubscribeMessage(Mesages.JOIN_ROOM)
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
            this.rooms.set(idRoom, room);
            client.join(idRoom);

            // Notify other members that a player has joined the room
            client.to(idRoom).emit('room', `Player: ${room.idPlayerTwo} has joined the room (${idRoom})`);
        }
    }

    @SubscribeMessage(Mesages.LAUNCH_GAME)
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

            this.mousesPos.set(room.idPlayerOne, {} as IMousePosDto);
            this.mousesPos.set(room.idPlayerTwo, {} as IMousePosDto);

            this.rooms.set(idRoom, room);

            await this.matchesServices.createMatch({
                idMatch: idRoom,
                idPlayerOne: room.idPlayerOne,
                idPlayerTwo: room.idPlayerTwo,
                startTime: new Date()
            });
        }
    }

    @SubscribeMessage(Mesages.UPDATE_CONFIG)
    updateConfig(client : Socket, idRoom : string, config : IStaticDto)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.config = config;
        this.rooms.set(idRoom, room);
    }

    @SubscribeMessage(Mesages.PLAYER_IS_READY)
    playerIsReady(client : Socket, idRoom : string, idPlayer : string)
    {  
        const room : IRoomDto = this.getRoom(idRoom);

        room.flags |= room.idPlayerOne == idPlayer
            ? State.PLAYER_ONE_READY : State.PLAYER_TWO_READY;
    }

    @SubscribeMessage(Mesages.PLAYER_ISNT_READY)
    playerIsNotReady(client : Socket, idRoom : string, idPlayer : string)
    {
        const room : IRoomDto = this.getRoom(idRoom)

        room.flags &= room.idPlayerOne == idPlayer
            ? ~State.PLAYER_ONE_READY : ~State.PLAYER_TWO_READY;
    }

    @SubscribeMessage(Mesages.ARE_PLAYERS_READY)
    arePlayersReady(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        return room.mode == GameMode.MULTI_PLAYER
            ? room.flags & State.PLAYER_ONE_READY
            && room.flags & State.PLAYER_TWO_READY
            : room.flags & State.PLAYER_ONE_READY;
    }

    @SubscribeMessage(Mesages.FIND_GAME)
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
                libName: LibNames.LIB_HORIZONTAL_MULTI,
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
    @SubscribeMessage(Mesages.CANCEL_QUEUE)
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

    @SubscribeMessage(Mesages.IS_IN_QUEUE)
    isInQueue(client : Socket, idRoom : string, idPlayer : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        for (const i in this.queue)
            if (i == idPlayer)
                return (true);
        return (false);
    }

    @SubscribeMessage(Mesages.LEAVE_ROOM)
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
    @SubscribeMessage(Mesages.DESTROY_ROOM)
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

    @SubscribeMessage(Mesages.END_GAME)
    async endGame(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        const matchEntity = await this.matchesServices.getCurrentMatchesById(idRoom);

        // TO DO: Need to be sure that "room.config.playerOne.score" and "room.config.playerTwo.score" are always numbers and not Scores
        await this.matchesServices.updateMatch(idRoom, {
            idMatch: idRoom,
            idPlayerOne: room.idPlayerOne,
            idPlayerTwo: room.idPlayerTwo,
            scorePlayerOne: Number(room.config.playerOne.score),
            scorePlayerTwo: Number(room.config.playerTwo.score),
            startTime: matchEntity.startTime,
            endTime: new Date()
        });
    }

    @SubscribeMessage(Mesages.SET_UP_GAME_STYLE)
    setUpGameStyle(client : Socket, idRoom : string, libName : LibNames)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.libName = libName;
        this.rooms.set(idRoom, room);
    }

    @SubscribeMessage(Mesages.GET_GAME_STYLE)
    getGameStyle(client : Socket, idRoom : string)
    {
        const room : IRoomDto = this.getRoom(idRoom);

        return room.libName;
    }

    @SubscribeMessage(Mesages.CALC_GAME_STATUS)
    calcPongStatus(client : Socket, idRoom : string, status : IDynamicDto)
    { return calcGameStatus(status, this.getRoom(idRoom).lib); }

    @SubscribeMessage(Mesages.SEND_MOUSE_POS)
    updateMousePosClient(client : Socket, idPlayer : string, mousePos : IMousePosDto)
    {
        // Can only update if player has joined a match
        if (idPlayer in this.mousesPos)
            this.mousesPos.set(idPlayer, mousePos);
    }

    getMousePosClient(idPlayer : string)
    {
        const pos = this.mousesPos.get(idPlayer);

        if (pos === undefined)
            throw new Error(); // Mouse pos not found

        return pos;
    }

    @SubscribeMessage(Mesages.SET_UP_BOT_LEVEL)
    setUpBotLevel(client : Socket, idRoom : string, botLevel : number)
    {
        const room : IRoomDto = this.getRoom(idRoom);
        room.level = botLevel;
        this.rooms.set(idRoom, room);
    }

    @SubscribeMessage(Mesages.GET_OTHER_PLAYER_ID)
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

    @SubscribeMessage(Mesages.SYNC_CUSTOMIZATION)
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
        this.rooms.set(idPlayer, room);
        return (room.info);
    }

    @SubscribeMessage(Mesages.GET_CUSTOMIZATION)
    getCustomization(client : Socket, roomId : string)
    {
        const room : IRoomDto = this.getRoom(roomId);

        return room.info;
    }

    @SubscribeMessage(Mesages.GET_PLAYERS_IDS)
    getPlayersIds(client : Socket, roomId : string)
    {
        const room : IRoomDto = this.getRoom(roomId);

        return { idPlayerOne: room.idPlayerOne, idPlayerTwo: room.idPlayerTwo };
    }
}

// TO DO:
/*
React elements:
- Use same room as pong for encapsulate handlers
- Use acknowledgement for syncronization stuff (last arg is a callback)

Pong:
- Use volatile events for positions share/receive
- Use a room for each game (room use in React elements )
- Redirect path to room id in url

MatchMaking:
- onClick "Find Game" => join queue ; wait until match (send a verification event each second)
    ; when a match is found => display ready button (players have a timeout to click on it (in the server and the client))
    ; onClick "Ready" -> both sides ? go to pong : timeout (wait until next match found) ;

Custom Game:
- Seems ok as is it

Spectator:
- Join a room
- Go to pong

HOW TO REIMPLEMENT:
- Emit both sides and construct handler in both sides, as easy as that.
- Be careful an use wiselly the rooms.

*/