import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import MatchesService from './matches.service';
import { SocketWithPlayer } from './socketWIthPlayer.interface';
import { PlayerStatusChangedDto } from './dto/playerStatusChanged.dto';
import { PlayerStatus } from './dto/playerStatus';
import { JoinGameDto } from './dto/joinGame.dto';
import { GameState } from './models/GameRoom';
import { GameRole } from './models/GameRole';
import { GameJoinedDto } from './dto/gameJoined.dto';
import { IVector2D } from './models/Vector2D';
import { Ruleset } from './dto/ruleset.dto';
import { Room } from './room';
import { IBall } from './models/Ball';
import UsersService from 'src/users/users.service';
import { ChannelsGateway } from 'src/channels/channels.gateway';
import MessageService from 'src/messages/messages.service';

export enum ServerMessages {
  CREATE_ROOM = 'server:createRoom',
  JOIN_ROOM = 'server:joinRoom',
  REJECT = 'server:reject',
  PUSH_GAME = 'server:pushGame',
  UPDATE_GAME = 'server:updateGame',
  FIND_GAME = 'server:findGame',
  CANCEL_FIND = 'server:cancelFind',
  UPDATE_MOUSE_POS = 'server:updateMousePos',
  CALC_GAME_ST = 'server:calcGameSt',
  LEAVE_ROOM = 'server:leaveRoom',
  PLAYER_READY = 'server:playerReady',
  PLAYER_GIVEUP = 'server:playerGiveUp',
  ACCEPT_INVITATION = 'server:acceptInvitation',
}

export enum ClientMessages {
  NOTIFY = "client:notify",
  MATCH_FOUND = "client:matchFound",
  RECEIVE_ST = "client:receiveSt",
  RECEIVE_STATUS = "client:receiveStatus",
  RECEIVE_PLAYERS = "client:receivePlayers",
  RECEIVE_SCORES = "client:receiveScores",
  RECEIVE_BALL = "client:receiveBall",
  JOINED = "client:joined",
  QUIT = 'client:quit',
  GUEST_REJECTION = "client:guestRejection",
  GAME_START = "client:gameStart",
  GAME_END = 'client:gameEnd',
  NO_GAME = 'client:noGame'
}

export const defaultRuleset: Ruleset = {
  duration: 3,
  rounds: 11,
  size: 2,
  speedMode: false,
  downsize: false
};

@Injectable()
@WebSocketGateway(0, { namespace: '/matches'})
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('MatchesGateway');

  /** Rooms mapped by match id */
  private rooms: Map<number, Room> = new Map();
  /** Joined rooms mapped by player's user ids */
  private joinedRooms: Map<number, number> = new Map();
  /** Current player's socket id mapped by player's id */
  private playerSockets: Map<number, string> = new Map();
  /** Key - Value array mapping player's socket by player's id */
  public matchmakingQueue: Array<[number, string]> = [];

  constructor(
    @Inject(forwardRef(() => MatchesService))
    private readonly matchesService: MatchesService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    // @Inject(forwardRef(() => ChannelsGateway))
    // private channelsGateway: ChannelsGateway
  ) {
    this.onDeleteRoom = this.onDeleteRoom.bind(this);
  }

  private getRoom(key: number) {
    const room: Room = this.rooms.get(key);

    if (room === undefined) throw new WsException('Room not found: id = ' + key);
    return room;
  }

  public setRoom(room: Room) {
    this.rooms.set(room.matchId, room);
  }

  afterInit(server: Server) {
    //this.logger.debug(`Listening at ${server.path()}`);
  }

  async handleConnection(socket: SocketWithPlayer) {
    this.logger.debug('Handling connection...');

    try {
      socket.user = await this.authenticationService.getUserFromSocket(socket);
      this.logger.debug(`New connection, socket.user.id: ${socket.user.id}`);
      socket.matchId = this.joinedRooms.has(socket.user.id)
        ? this.joinedRooms.get(socket.user.id)
        : undefined;
    } catch (e) {
      this.logger.error(`Disconnected: ${e}`);
      socket.disconnect(true);
      return;
    }

    socket.emit('authenticated');
  }

  async onUserDisconnect(socket: SocketWithPlayer) {
    this.logger.debug(
      `Client ${socket.user.id} disconnecting with ${socket.rooms.size} joined rooms`,
    );

    if (socket.matchId !== undefined) {
      this.onStatusChanged(
        socket.matchId,
        socket.user.id,
        PlayerStatus.DISCONNECTED,
      );
    }
  }

  async handleDisconnect(socket: Socket | SocketWithPlayer) {
    this.logger.debug('Handling disconnection...');

    if ('user' in socket) {
      //await this.onUserDisconnect(socket as SocketWithPlayer);
      await this.onLeaveRoom(socket as SocketWithPlayer);
      this.logger.debug(
        `Authenticated user ${(socket as SocketWithPlayer).user.id
        } disconnected`,
      );
    } else {
      this.logger.debug('Unauthenticated client disconnected');
    }
  }

  private onStatusChanged(
    gameId: number,
    userId: number,
    status: PlayerStatus,
  ) {
    const statusChange: PlayerStatusChangedDto = {
      userId,
      status,
    };
    const room = this.getRoom(gameId);

    // TO DO: This is an error (room is undfined)
    const player = room.state.players.get(userId);

    player.status = status;

    this.server.to(gameId.toFixed()).emit('status', statusChange);
  }

  @SubscribeMessage(ServerMessages.ACCEPT_INVITATION)
  async handleAcceptInvitation(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto
  ) {
    const room = this.getRoom(body.roomId);

    this.logger.debug(`[MATCHES GATEWAY] Invited ${socket.user.id} accepted invitation and joined ${body.roomId}`);
    room.invitePlayer(socket.user.id);

    this.messageService.deleteMessage(body.messageId)
    
  }

  @SubscribeMessage(ServerMessages.JOIN_ROOM)
  async handleJoin(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto,
  ) {

    console.log('JOIN_ROOM', body.roomId)
    //this.logger.debug(`[MATCHES GATEWAY] player ${socket.user.id} joined room ${body.roomId}` )
    try {
      const room = this.getRoom(body.roomId);
      
      // Check if the user is allowed to play
      let role: GameRole;
      
      this.logger.debug(`[MATCHES GATEWAY] players: ${[...room.playerIds]}`);
      
      if (room.playerIds.includes(socket.user.id)) {
        role = GameRole.Player;
        this.playerSockets.set(socket.user.id, socket.id);
        // TO DO: I've needed to add this condition cause addPlayer was called twice for first player, need to find out the reason in a future
        if (room.state.players.has(socket.user.id) === false) {
          room.addPlayer(socket.user.id);
        }
      } else {
        role = GameRole.Spectator;
      }
      
      this.logger.debug(
        `[MATCHES GATEWAY] user ${socket.user.id} has joined room ${body.roomId} with role: ${role}`,
        );
        
        socket.join(room.getId());
        
        const data: GameJoinedDto = { role };
        
        socket.matchId = body.roomId;
        this.server
        .to(socket.id)
        .emit(ClientMessages.RECEIVE_PLAYERS, [...room.state.players.values()]);
        this.server.to(socket.id).emit(ClientMessages.JOINED, data);
      } catch(error) {
        this.server.to(socket.id).emit(ClientMessages.NO_GAME);
        console.log(error)
      }

  }

  @SubscribeMessage(ServerMessages.REJECT)
  async handleRejectMatch(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto,
  ) {
    const room = this.getRoom(body.roomId);

    this.logger.debug(`User with id ${socket.user.id} rejected the match`);

    this.server
      .to(room.getId())
      .emit(
        ClientMessages.NOTIFY,
        `User with id ${socket.user.id} rejected the match`,
      );

    this.server
      .to(room.playerIds[0].toFixed())
      .emit(ClientMessages.GUEST_REJECTION);

    this.server.socketsLeave(room.playerIds.toString());
    this.rooms.delete(room.matchId);
  }

  async onGameEnd(roomId: number) {
    const room: Room = this.getRoom(roomId);

    await this.matchesService.updateMatch(roomId, {
      scores: room.state.scores,
      // TODO: Set endTime
    });

    this.logger.debug(
      '[MATCH GATEWAY] game must be update in the database now (as a finished one)',
    );
  }

  private matchmakingQueueContains(userId: number) {
    for (let i of this.matchmakingQueue) {
      if (i[0] === userId) return true;
    }
    return false;
  }

  @SubscribeMessage(ServerMessages.FIND_GAME)
  async handleFindGame(@ConnectedSocket() client: SocketWithPlayer) {
    if (this.matchmakingQueueContains(client.user.id) === false) {
      this.matchmakingQueue.push([client.user.id, client.id]);
      this.logger.debug(
        `[MATCHES GATEWAY] user ${client.user.id} (${client.id}) has joined the matchmaking queue`,
      );
    }

    if (this.matchmakingQueue.length >= 2) {
      const playerIds = this.matchmakingQueue.splice(-2);

      this.logger.debug(
        `[MATCHES GATEWAY] users ${playerIds[0][0]} and ${playerIds[1][0]} found a game`,
      );

      const { id } = await this.matchesService.createMatch(
        playerIds[0][0],
        {
          guests: [playerIds[1][0]],
          ruleset: defaultRuleset,
        },
        true,
      );

      //this.playerSockets.set(playerIds[0][0], playerIds[0][1]);
      //this.playerSockets.set(playerIds[1][0], playerIds[1][1]);

      playerIds.forEach((player) => {
        this.server.to(player[1]).emit(ClientMessages.MATCH_FOUND, id);
      });
    }
  }

  @SubscribeMessage(ServerMessages.CANCEL_FIND)
  async handleCancelFind(@ConnectedSocket() client: SocketWithPlayer) {
    if (this.matchmakingQueueContains(client.user.id)) {
      // TO DO: Why this don't work ?
      //this.matchmakingQueue.filter(player => player !== client.user.id);
      for (let i = 0; i < this.matchmakingQueue.length; i++) {
        if (this.matchmakingQueue[i][0] === client.user.id) {
          this.matchmakingQueue.splice(i, 1);
        }
      }
      this.logger.debug(
        `[MATCHES GATEWAY] user ${client.user.id} has left the queue`,
      );
    }
  }

  @SubscribeMessage(ServerMessages.PLAYER_READY)
  handlePlayerReady(@ConnectedSocket() client: SocketWithPlayer) {
    const room = this.getRoom(client.matchId);

    room.setPlayerStatus(client.user.id, PlayerStatus.READY);

    this.logger.debug(`[MATCHES GATEWAY] On ready: isFilled: ${room.isFilled()}, playersReady: ${room.playersReady()}`);

    if (room.isFilled() && room.playersReady()) {
      room.onStartGame();
    }
  }
  ///////////////////////////////////////////////////////////////////
  @SubscribeMessage(ServerMessages.PLAYER_GIVEUP)
  handlePlayerGiveUp(@ConnectedSocket() client: SocketWithPlayer) {
    const room = this.getRoom(client.matchId);

    room.setPlayerStatus(client.user.id, PlayerStatus.GIVEUP);

    this.logger.debug(`[MATCHES GATEWAY] Give up: ${client.user.id}`);

    // if (room.isFilled() && room.playersReady()) {
    //   room.onStartGame();
    //   room.playerIds.forEach((playerId) => {
    //     if (this.playerSockets.has(playerId)) {
    //       this.logger.debug(`[MATCHES GATEWAY] user ${this.playerSockets.get(playerId)} is ready to play`);
    //       this.server.to(this.playerSockets.get(playerId)).emit(ClientMessages.GAME_START);
    //     }
    //   });
    // }
  }

  onClientStartGame(matchId: number) {
    const room = this.getRoom(matchId);

    room.playerIds.forEach((playerId) => {
      if (this.playerSockets.has(playerId)) {
        this.logger.debug(`[MATCHES GATEWAY] user ${this.playerSockets.get(playerId)} is ready to play`);
        this.server.to(this.playerSockets.get(playerId)).emit(ClientMessages.GAME_START);
      }
    });
  }

  @SubscribeMessage(ServerMessages.UPDATE_MOUSE_POS)
  async onUpdateMousePos(
    @ConnectedSocket() client: SocketWithPlayer,
    @MessageBody() mousePos: IVector2D,
  ) {
    //this.logger.debug("[MATCHES GATEWAY] receiving mouse pos ...");
    const roomId = client.matchId;
    const room = this.getRoom(roomId);

    room.setMousePos(client.user.id, mousePos);
  }

  //@SubscribeMessage(ServerMessages.LEAVE_ROOM)
  async onLeaveRoom(
    @ConnectedSocket() client: SocketWithPlayer,
  ) {
    if (client.matchId !== undefined) {
      this.logger.debug(`[MATCHES GATEWAY] On leave room: match id: ${client.matchId}`);
      const room = this.rooms.get(client.matchId);
      const player = room.playerIds.includes(client.user.id);
      if (room && player) {
        client.leave(room.getId());
      room.setPlayerStatus(client.user.id, PlayerStatus.DISCONNECTED);
        
      this.logger.debug(
        `[MATCHES GATEWAY] player ${client.user.id} has disconected to the game`,
      );
      }      
    }
  }

  onGameUpdate(roomId: number, state: GameState) {
    //this.logger.debug(`[MATCHES GATEWAY] Update game ${roomId.toFixed()}`);

    this.server
      .to(roomId.toFixed())
      .emit(ClientMessages.RECEIVE_STATUS, state.status);

    this.server
      .to(roomId.toFixed())
      .emit(ClientMessages.RECEIVE_PLAYERS, [...state.players.values()]);

    this.server
      .to(roomId.toFixed())
      .emit(ClientMessages.RECEIVE_SCORES, state.scores);

    this.server
      .to(roomId.toFixed())
      .emit(ClientMessages.RECEIVE_BALL, {
        ...(state.ball as IBall), defaultBall: undefined
      } as IBall);
  }

  updateWinLossCount = async (userId: number, won: boolean) => {
    const user = await this.usersService.getUserById(userId);
    if (user) {
      delete user.status;
      delete user.roomId;
      if (won) {
        this.usersService.updateUser(userId, {
          ...user,
          nbWin: user.nbWin + 1
        })
      } else {
        this.usersService.updateUser(userId, {
          ...user,
          nbLoss: user.nbLoss + 1
        })
      }
    }
  }

  private onDeleteRoom(roomId : number) {
    this.rooms.delete(roomId);
  }

  onDisconnectClients(roomId: number) {
    try {
      const room = this.getRoom(roomId);

      this.matchesService.updateMatch(roomId, {
        playerIds: [...room.playerIds],
        scores: [...room.state.scores]
      });

      let exaequo = false;
      if (room.state.scores[0] === room.state.scores[1]) {
        exaequo = true;
      }

      room.playerIds.forEach((playerId) => {
        if (!exaequo) {
          const player = room.getPlayer(playerId);
          if (player.side === 'left') {
            this.updateWinLossCount(playerId, room.state.scores[0] > room.state.scores[1])
          } else if (player.side === 'right') {
            this.updateWinLossCount(playerId, room.state.scores[1] > room.state.scores[0])
          }
        }
        this.logger.debug(
          `[MATCHES GATEWAY] Emit GAME_END to client ${playerId}`,
        );
        this.server.to(this.playerSockets.get(playerId)!).emit(ClientMessages.GAME_END);
        this.playerSockets.delete(playerId);
      });
      setTimeout(this.onDeleteRoom, 30 * 1000);
      
    } catch (error) { console.log(error) }
  }
}
