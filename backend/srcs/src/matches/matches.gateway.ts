import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import MatchesService from './matches.service';
import { SocketWithPlayer } from './socketWIthPlayer.interface';
import { PlayerStatusChangedDto } from './dto/playerStatusChanged.dto';
import { PlayerStatus } from './dto/playerStatus';
import { JoinGameDto } from './dto/joinGame.dto';
import { GameRoom } from './models/GameRoom';
import { GameRole } from './models/GameRole';
import { GameJoinedDto } from './dto/gameJoined.dto';

@Injectable()
@WebSocketGateway(undefined, { namespace: '/matches' })
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('MatchesGateway');

  /** Rooms mapped by match id */
  private rooms: Map<number, GameRoom> = new Map();
  /** Joined rooms mapped by player's user ids */
  private joinedRooms: Map<number, number> = new Map();

  constructor(
    private readonly matchesService: MatchesService,
    private readonly authenticationService: AuthenticationService,
  ) {}

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

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() socket: SocketWithPlayer,
    @MessageBody() body: JoinGameDto,
  ) {
    if (this.rooms.has(body.id)) {
      const room = this.rooms.get(body.id);

      // Check if the user is allowed to play
      const role = room.playerIds.includes(socket.user.id)
        ? GameRole.Player
        : GameRole.Spectator;

      const data: GameJoinedDto = { role };

      socket.emit('joined', data);
    }
  }
}
