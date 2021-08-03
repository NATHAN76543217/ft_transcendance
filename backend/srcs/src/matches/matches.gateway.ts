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
}

export enum ClientMessages {
  NOTIFY = 'client:notify',
  MATCH_FOUND = 'client:matchFound',
  RECEIVE_ST = 'client:receiveSt',
  JOINED = 'client:joined',
  QUIT = 'client:quit',
  GUEST_REJECTION = 'client:guestRejection',
  GAME_START = 'client:gameStart',
  GAME_END = 'client:gameEnd',
}

export const defaultRuleset: Ruleset = {
  duration: 3,
  rounds: 11,
  size: 2,
};

@Injectable()
@WebSocketGateway(0, { namespace: '/matches' })
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('MatchesGateway');

  /** Rooms mapped by match id */
  private rooms: Map<number, Room> = new Map();
  /** Joined rooms mapped by player's user ids */
  private joinedRooms: Map<number, number> = new Map();

  public matchmakingQueue: Array<[number, string]> = []; // <user id, socket id>

  constructor(
    @Inject(forwardRef(() => MatchesService))
    private readonly matchesService: MatchesService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  private getRoom(key: number) {
    const room: Room = this.rooms.get(key);

    if (room === undefined) throw new WsException('Room not found');
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
      await this.onUserDisconnect(socket as SocketWithPlayer);
      this.logger.debug(
        `Authenticated user ${
          (socket as SocketWithPlayer).user.id
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
    const room = this.rooms.get(gameId);

    const player = room.state.players.get(userId);

    player.status = status;

    this.server.to(gameId.toFixed()).emit('status', statusChange);
  }

  @SubscribeMessage(ServerMessages.JOIN_ROOM)
  async handleJoin(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto,
  ) {
    const room = this.getRoom(body.id);

    // Check if the user is allowed to play
    let role: GameRole;

    if (room.playerIds.includes(socket.user.id)) {
      role = GameRole.Player;
      room.addPlayer(socket.user.id);
    } else {
      role = GameRole.Spectator;
    }

    this.logger.debug(
      `[MATCHES GATEWAY] user ${socket.user.id} has joined room ${body.id} with role: ${role}`,
    );

    const data: GameJoinedDto = { role };

    socket.matchId = body.id;
    socket.emit(ClientMessages.JOINED, data);
  }

  @SubscribeMessage(ServerMessages.REJECT)
  async handleRejectMatch(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto,
  ) {
    const room = this.getRoom(body.id);

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
          ruleset: {},
        },
        true,
      );

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

    if (room.isFilled() && room.playersReady()) {
      this.logger.debug(
        `[MATCHES GATEWAY] user ${client.user.id} is ready to play`,
      );
      room.onStartGame();
      room.playerIds.forEach((playerId) => {
        this.server.to(playerId.toFixed()).emit(ClientMessages.GAME_START);
      });
    }
  }

  @SubscribeMessage(ServerMessages.UPDATE_MOUSE_POS)
  async onUpdateMousePos(
    @ConnectedSocket() client: SocketWithPlayer,
    @MessageBody() mousePos: IVector2D,
  ) {
    const roomId = client.matchId;
    const room = this.getRoom(roomId);

    room.setMousePos(client.user.id, mousePos);
  }

  @SubscribeMessage(ServerMessages.LEAVE_ROOM)
  onLeaveRoom(
    @ConnectedSocket() client: SocketWithPlayer,
    @MessageBody() roomId: number,
  ) {
    const room = this.getRoom(roomId);

    client.leave(room.getId());
    //room.playerIds.filter((id) => id !== playerId);

    room.setPlayerStatus(client.user.id, PlayerStatus.DISCONNECTED);

    this.logger.debug(
      `[MATCHES GATEWAY] player ${client.user.id} has disconected to the game`,
    );

    client
      .to(room.getId())
      .emit(
        ClientMessages.NOTIFY,
        `Player with id ${client.user.id} left the room`,
      );

    if (room.playerIds.length === 0) {
      this.rooms.delete(room.matchId);
      this.logger.debug(
        `[MATCHES GATEWAY] room with id ${room.matchId} has been destroyed`,
      );
    }
  }

  onGameUpdate(roomId: number, state: GameState) {
    this.server.volatile
      .to(roomId.toFixed())
      .emit(ClientMessages.RECEIVE_ST, { state });
  }

  onDisconnectClients(roomId: number) {
    const room = this.getRoom(roomId);

    room.playerIds.forEach((playerId) => {
      this.logger.debug(
        `[MATCHES GATEWAY] player ${playerId} should not be inGame now`,
      );
      this.server.to(playerId.toFixed()).emit(ClientMessages.GAME_END);
    });
    this.server.to(roomId.toFixed()).emit(ClientMessages.QUIT);
  }
}
