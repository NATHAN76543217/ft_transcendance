import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import MatchesService from './matches.service';
import { SocketWithPlayer } from './socketWIthPlayer.interface';
import { PlayerStatusChangedDto } from './dto/playerStatusChanged.dto';
import { PlayerStatus } from './dto/playerStatus';

@Injectable()
@WebSocketGateway(undefined, { namespace: '/matches' })
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('MatchesGateway');

  /** Rooms mapped by match id */
  private rooms: Map<number, any> = new Map();
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

    this.server.to(gameId.toFixed()).emit('status', statusChange);
  }
}
