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
import CreateMessageDto from 'src/messages/dto/createMessage.dto';
import {
  ChannelAction,
  ChannelCaslAbilityFactory,
} from './channel-casl-ability.factory';
import MessageService from 'src/messages/messages.service';
import { MessageType } from 'src/messages/message.entity';
import { UserStatus } from 'src/users/utils/userStatus';
import UserRelationshipsService from 'src/users/relationships/user-relationships.service';

// TODO: Rename to EventsModule...
@Injectable()
@WebSocketGateway(undefined, { namespace: '/events' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChannelsGateway');

  constructor(
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly messageService: MessageService,
    private readonly abilityFactory: ChannelCaslAbilityFactory,
    private readonly userRelationshipService: UserRelationshipsService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Listening at ${server.path()}`);
  }

  async broadcastStatusChange(socket: SocketWithUser, status: UserStatus) {
    const rels =
      await this.userRelationshipService.getAllUserRelationshipsFromOneUser(
        socket.user.id.toString(),
      );

    // TODO: Filter by relation state
    this.logger.debug(`Notifying ${rels.length} rels...`);
    rels.forEach((rel) => {
      const otherId =
        socket.user.id === Number(rel.user1_id) ? rel.user2_id : rel.user1_id;

      socket.to(otherId).emit('statusChanged', {
        user_id: socket.user.id,
        status,
      });
    });
  }

  async handleConnection(socket: SocketWithUser) {
    try {
      socket.user = await this.channelsService.getUserFromSocket(socket);
    } catch (e) {
      this.logger.error(`Disconnected: ${e}`);
      socket.disconnect(true);
      return;
    }

    socket.emit('authenticated');

    socket.on('disconnecting', () => {
      // TODO: set offline status
      this.logger.debug(
        `Client ${socket.user.id} disconnecting with ${socket.rooms.size} joined rooms`,
      );

      socket.rooms.forEach((r) => {
        socket.to(r).emit('disconnected', { username: socket.user.name });
      });
    });

    this.broadcastStatusChange(socket, UserStatus.online);

    // Join self named channel
    socket.join(socket.user.id.toString());
    // Join user channels
    socket.user.channels.forEach((c) => {
      const channel = `#${c.channel!.id}`;
      this.logger.log(`User joining ${channel}`);

      socket.join(channel);
      // TODO: Check which data to send on join
      // TODO: Use a status event and set connected as its value
      socket.to(channel).emit('connected', { username: socket.user.name });
    });

    // Notify friends about status

    this.logger.debug(
      `Client ${socket.user.id} connected with ${
        socket.rooms.size - 2
      } joined channels`,
    );

    return { event: 'connected' };
  }

  async handleDisconnect(socket: SocketWithUser) {
    this.broadcastStatusChange(socket, UserStatus.offline);
    // Check if we have a room list here
    this.logger.debug(
      `Client disconnect with ${socket.rooms.size} joined rooms`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: CreateMessageDto,
  ) {
    const author = socket.user;
    const channel = await this.channelsService.getChannelById(body.channel_id);
    const abilities = this.abilityFactory.createForUser(author);

    if (
      body.type === MessageType.Text &&
      abilities.can(ChannelAction.Speak, channel)
    ) {
      const message = await this.messageService.createMessage(body, author.id);

      this.server
        .to(channel.id.toFixed())
        .emit('message', JSON.stringify(message));
      this.logger.debug(`${channel.name}: ${author.name}: ${body.data}`);
    } else {
      this.logger.debug(`${author.name}: ${body.data}`);
    }
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
