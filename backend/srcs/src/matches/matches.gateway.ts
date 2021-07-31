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
}

export const defaultRuleset: Ruleset = {
  duration: 3,
  rounds: 11,
  size: 2,
};

@Injectable()
@WebSocketGateway(undefined, { namespace: '/matches' })
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

  public matchmakingQueue: number[];

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

  afterInit(server: any) {
    this.logger.log(`Listening at ${server.path()}`);
  }

  async handleConnection(socket: SocketWithPlayer) {
    try {
      socket.user = await this.authenticationService.getUserFromSocket(socket);
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

    const data: GameJoinedDto = { role };

    socket.matchId = body.id;
    socket.emit(ClientMessages.JOINED, data);
  }

  async onGameEnd(roomId: number) {
    const room: Room = this.getRoom(roomId);

    await this.matchesService.updateMatch(roomId, {
      scores: room.state.scores,
      // TODO: Set endTime
    });
  }

  @SubscribeMessage(ServerMessages.FIND_GAME)
  handleFindGame(client: SocketWithPlayer) {
    if (!this.matchmakingQueue.includes(client.user.id)) {
      this.matchmakingQueue.push(client.user.id);
    }

    if (this.matchmakingQueue.length >= 2) {
      const playerIds = this.matchmakingQueue.splice(-2);

      this.matchesService.createMatch(playerIds[0], {
        guests: playerIds.slice(1),
        ruleset: {},
      });
    }
  }

  @SubscribeMessage(ServerMessages.CANCEL_FIND)
  handleCancelFind(client : SocketWithPlayer)
  {
    if (!this.matchmakingQueue.includes(client.user.id))
      throw new Error();
    this.matchmakingQueue.filter(player => player !== client.user.id);
  }

  @SubscribeMessage(ServerMessages.PLAYER_READY)
  handlePlayerReady(client: SocketWithPlayer) {
    const room = this.getRoom(client.matchId);

    room.setPlayerStatus(client.user.id, PlayerStatus.READY);
  }

  @SubscribeMessage(ServerMessages.UPDATE_MOUSE_POS)
  onUpdateMousePos(client: SocketWithPlayer, mousePos: IVector2D) {
    const roomId = client.matchId;
    const room = this.getRoom(roomId);

    room.setMousePos(client.user.id, mousePos);
  }

  @SubscribeMessage(ServerMessages.LEAVE_ROOM)
  onLeaveRoom(client: SocketWithPlayer, roomId: number, playerId: number) {
    const room = this.getRoom(roomId);

    client.leave(room.getId());
    //room.playerIds.filter((id) => id !== playerId);

    room.setPlayerStatus(client.user.id, PlayerStatus.DISCONNECTED);

    client
      .to(room.getId())
      .emit(ClientMessages.NOTIFY, `Player with id ${playerId} left the room`);

    if (room.playerIds.length === 0) this.rooms.delete(room.matchId);
  }

  onGameUpdate(roomId: number, state: GameState) {
    this.server.to(roomId.toFixed()).emit(ClientMessages.RECEIVE_ST, { state });
  }
}
