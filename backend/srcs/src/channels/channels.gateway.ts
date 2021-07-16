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
import ChannelsService from './channels.service';
import { Socket, Server } from 'socket.io';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { SocketWithUser } from 'src/authentication/socketWithUser.interface';

@Injectable()
@WebSocketGateway(undefined, { namespace: '/channels' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChannelsGateway');

  constructor(
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
  ) {}

  afterInit(server: Server) {
    this.logger.debug(`Listening at ${server.path()}`);
  }

  async handleConnection(socket: SocketWithUser) {
    this.logger.debug(`Query: ${JSON.stringify(socket.handshake.query)}`);
    try {
      socket.user = await this.channelsService.getUserFromSocket(socket);
    } catch (e) {
      socket.disconnect(true);
      return;
    }

    socket.emit('authenticated');

    socket.on('disconnecting', () => {
      // TODO: set offline status
      this.logger.debug(
        `Client disconnecting with ${socket.rooms.size} joined rooms`,
      );

      socket.rooms.forEach((r) => {
        socket.to(r).emit('disconnected', { username: socket.user.name });
      });
    });

    // TODO: set online status

    // TODO: Maybe join self named channel to receive friend invitations etc...
    // Join user channels
    socket.user.channels.forEach((c) => {
      Logger.debug(c.channel!.id);
      const channel = c.channel!.id.toFixed();

      socket.join(channel);
      // TODO: Check which data to send on join
      // TODO: Use a status event and set connected as its value
      socket.to(channel).emit('connected', { username: socket.user.name });
    });

    this.logger.debug(
      `Client connected with ${socket.rooms.size} joined rooms`,
    );

    return { event: 'connected' };
  }

  async handleDisconnect(socket: Socket) {
    // Check if we have a room list here
    this.logger.debug(
      `Client disconnect with ${socket.rooms.size} joined rooms`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    const author = await this.channelsService.getUserFromSocket(socket);

    // TODO: Replace getUser with SocketWithUser
    // TODO: Broadcast messages by room
    // TODO: Save messages to repository

    this.logger.debug(`${author.name}: ${{ data }}`);
  }

  async closeChannel(id: number) {
    const roomName = id.toFixed();

    this.server.to(roomName).emit('leave');
    const socketIds = await this.server.in(roomName).allSockets();

    // Force all sockets to leave the deleted room
    socketIds.forEach((socketId) => {
      this.server.sockets.sockets.get(socketId).leave(roomName);
    });
  }
}
