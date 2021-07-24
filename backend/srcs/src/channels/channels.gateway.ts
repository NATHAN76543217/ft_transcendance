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
import UpdateRelationshipDto from 'src/messages/dto/updateRelationship.dto';
import { UserRelationshipTypes } from 'src/users/relationships/userRelationshipTypes';

// TODO: Rename to EventsModule...
@Injectable()
@WebSocketGateway(undefined, { namespace: '/events' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChannelsGateway');

  constructor(
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly messageService: MessageService,
    private readonly abilityFactory: ChannelCaslAbilityFactory,
    private readonly userRelationshipService: UserRelationshipsService,
  ) { }

  afterInit(server: Server) {
    this.logger.log(`Listening at ${server.path()}`);
  }

  @SubscribeMessage('updateRelationship-front')
  async handleUpdateRelationship(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateRelationshipDto,
  ) {
    console.log(`updateRelationship-front - begin`)
    console.log(`senderId = ${socket.user.id}`)
    console.log(`receiverId = ${body.user_id}`)
    console.log(`type = ${body.type}`)
    const inf = socket.user.id < body.user_id
    console.log(`inf = ${inf}`)
    const user1_id = inf ? socket.user.id.toString() : body.user_id.toString()
    const user2_id = inf ? body.user_id.toString() : socket.user.id.toString()
    console.log(`user1_id = ${user1_id}`)
    console.log(`user2_id = ${user2_id}`)
    let relationship;
    try {
      relationship = await this.userRelationshipService.getUserRelationshipByIds(user1_id, user2_id)
      console.log(`relationship found - relation`, relationship)
      if (body.type !== UserRelationshipTypes.null) {
        this.userRelationshipService.updateUserRelationship(relationship.id, { type: body.type })
      } else {
        this.userRelationshipService.deleteUserRelationship(relationship.id);
      }
      console.log(`relationship found - update OK`)
    }
    catch (error) {
      console.log(`relationship not there`)
      relationship = await this.userRelationshipService.createUserRelationship({
        user1_id: user1_id,
        user2_id: user2_id,
        type: body.type
      })
      console.log(`relationship not there - relation`, relationship)
    }
    socket.to(user1_id).emit("updateRelationship-back", { user_id: user2_id, type: body.type })
    socket.to(user2_id).emit("updateRelationship-back", { user_id: user1_id, type: body.type })
    console.log(`updateRelationship-front - end`)
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
      `Client ${socket.user.id} connected with ${socket.rooms.size - 2
      } joined channels`,
    );

    return { event: 'connected' };
  }

  async onUserDisconnect(socket: SocketWithUser) {
    await this.broadcastStatusChange(
      socket as SocketWithUser,
      UserStatus.offline,
    );
  }

  async handleDisconnect(socket: Socket | SocketWithUser) {
    if ('user' in socket) {
      await this.onUserDisconnect(socket as SocketWithUser);
      this.logger.debug(
        `Authenticated user ${(socket as SocketWithUser).user.id} disconnected`,
      );
    } else {
      this.logger.debug('Unauthenticated client disconnected');
    }
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
