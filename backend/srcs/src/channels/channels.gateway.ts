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
import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
import UpdateRoleDto from 'src/messages/dto/updateRole.dto';
import UsersService from 'src/users/users.service';
import ChannelRelationshipsService from './relationships/channel-relationships.service';
import UpdateChannelRelationshipDto from './dto/UpdateChannelRelationship.dto';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { ChannelMode } from './utils/channelModeTypes';
import ChannelNotFound from './exception/ChannelNotFound.exception';
import ChannelRelationshipByIdsNotFound from './exception/ChannelRelationshipByIdsNotFound.exception';
import { DestroyChannelDto } from './dto/DestroyChannel.dto';

// TODO: Rename to EventsModule...
@Injectable()
@WebSocketGateway(undefined, { namespace: '/events' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('ChannelsGateway');

  constructor(
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly channelRelationshipsService: ChannelRelationshipsService,
    private readonly messageService: MessageService,
    private readonly abilityFactory: ChannelCaslAbilityFactory,
    private readonly userService: UsersService,
    private readonly userRelationshipService: UserRelationshipsService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Listening at ${server.path()}`);
  }

  @SubscribeMessage('updateRelationship-front')
  async handleUpdateRelationship(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateRelationshipDto,
  ) {
    const inf = socket.user.id < body.user_id;
    const user1_id = inf ? socket.user.id.toString() : body.user_id.toString();
    const user2_id = inf ? body.user_id.toString() : socket.user.id.toString();
    let relationship;
    try {
      relationship =
        await this.userRelationshipService.getUserRelationshipByIds(
          user1_id,
          user2_id,
        );
      if (body.type !== UserRelationshipTypes.null) {
        this.userRelationshipService.updateUserRelationship(relationship.id, {
          type: body.type,
        });
      } else {
        this.userRelationshipService.deleteUserRelationship(relationship.id);
      }
    } catch (error) {
      relationship = await this.userRelationshipService.createUserRelationship({
        user1_id: user1_id,
        user2_id: user2_id,
        type: body.type,
      });
    }
    socket.emit('updateRelationship-back', {
      user_id: body.user_id.toString(),
      type: body.type,
    });
    socket
      .to(body.user_id.toString())
      .emit('updateRelationship-back', {
        user_id: socket.user.id.toString(),
        type: body.type,
      });
  }

  @SubscribeMessage('updateRole-front')
  async handleUpdateRole(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateRoleDto,
  ) {
    let user;
    try {
      user = await this.usersService.getUserById(body.user_id);
      this.usersService.updateUser(user.id, {
        ...user,
        role: body.role,
      });
    } catch (error) {
      console.log(error);
    }
    socket.emit('updateRole-back', { user_id: body.user_id, role: body.role });
    socket
      .to(body.user_id.toString())
      .emit('updateRole-back', { user_id: body.user_id, role: body.role });
  }

  @SubscribeMessage('updateChannelRelationship-front')
  async handleUpdateChannelRelationship(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateChannelRelationshipDto,
  ) {
    let relationship;
    try {
      relationship =
        await this.channelRelationshipsService.getChannelRelationshipByIds(
          body.channel_id,
          body.user_id,
        );
      if (Number(body.type) !== Number(ChannelRelationshipType.Null)) {
        this.channelRelationshipsService.updateChannelRelationship({
          type: body.type,
          channel_id: body.channel_id,
          user_id: body.user_id,
        });
      } else {
        this.channelRelationshipsService.deleteChannelRelationship({
          channel_id: body.channel_id,
          user_id: body.user_id,
        });
      }
    } catch (error) {
      relationship =
        await this.channelRelationshipsService.createChannelRelationship({
          type: body.type,
          channel_id: body.channel_id,
          user_id: body.user_id,
        });
    }
    socket.emit('updateChannelRelationship-back', {
      channel_id: body.channel_id.toString(),
      user_id: body.user_id.toString(),
      type: body.type,
    });
    socket
      .to(body.user_id.toString())
      .emit('updateChannelRelationship-back', {
        channel_id: body.channel_id.toString(),
        user_id: body.user_id.toString(),
        type: body.type,
      });
  }

  @SubscribeMessage('joinChannel-front')
  async handleJoinChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: JoinChannelDto,
  ) {
    console.log(`joinChannel-front`);
    let channel;
    let newType = ChannelRelationshipType.Member;
    try {
      channel = await this.channelsService.getChannelById(body.channel_id);
      if (!channel.users.length) {
        newType = ChannelRelationshipType.Owner;
      }
    } catch (e) {
      throw new ChannelNotFound(body.channel_id);
    }
    try {
      const relationship =
        await this.channelRelationshipsService.getChannelRelationshipByIds(
          body.channel_id,
          socket.user.id,
        );
      if (relationship.type === ChannelRelationshipType.Banned) {
        throw new HttpException('You are banned from this channel', 400);
      } else if (relationship.type !== ChannelRelationshipType.Invited) {
        newType = relationship.type;
      }
    } catch (error) {}
    if (channel.mode === ChannelMode.protected) {
      await this.channelsService.verifyPassword(
        body.password,
        channel.password,
      );
    }
    await this.channelRelationshipsService.createChannelRelationship({
      channel_id: body.channel_id,
      user_id: socket.user.id,
      type: newType,
    });

    socket.emit('joinChannel-back', {
      channel_id: body.channel_id.toString(),
      user_id: socket.user.id.toString(),
      type: newType,
    });
    socket
      .to(socket.user.id.toString())
      .emit('joinChannel-back', {
        channel_id: body.channel_id.toString(),
        user_id: socket.user.id.toString(),
        type: newType,
      });
  }

  @SubscribeMessage('leaveChannel-front')
  async handleLeaveChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: JoinChannelDto,
  ) {
    console.log(`leaveChannel-front`);

    try {
      const channel = await this.channelsService.getChannelById(
        body.channel_id,
      );
    } catch (e) {
      throw new ChannelNotFound(body.channel_id);
    }
    let newType = ChannelRelationshipType.Null;
    try {
      const relationship =
        await this.channelRelationshipsService.getChannelRelationshipByIds(
          body.channel_id,
          socket.user.id,
        );
      if (relationship.type & ChannelRelationshipType.Banned) {
        newType = ChannelRelationshipType.Banned;
      } else if (relationship.type & ChannelRelationshipType.Muted) {
        newType = ChannelRelationshipType.Muted;
      }
      if (newType !== ChannelRelationshipType.Null) {
        await this.channelsService.updateChannelRelationship(
          body.channel_id,
          socket.user.id,
          newType,
        );
      } else {
        await this.channelsService.deleteChannelRelationship(
          body.channel_id,
          socket.user.id,
        );
      }
      socket.emit('leaveChannel-back', {
        channel_id: body.channel_id.toString(),
        user_id: socket.user.id.toString(),
        type: newType,
      });
      socket
        .to(socket.user.id.toString())
        .emit('leaveChannel-back', {
          channel_id: body.channel_id.toString(),
          user_id: socket.user.id.toString(),
          type: newType,
        });
    } catch (error) {
      throw new ChannelRelationshipByIdsNotFound(
        body.channel_id,
        socket.user.id,
      );
    }
  }

  @SubscribeMessage('destroyChannel-front')
  async handleDestroyChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: DestroyChannelDto,
  ) {
    console.log(`destroyChannel-front`);
    let channel;
    try {
      channel = await this.channelsService.getChannelById(body.channel_id);
    } catch (e) {
      throw new ChannelNotFound(body.channel_id);
    }
    try {
      const abilities = this.abilityFactory.createForUser(socket.user);
      if (abilities.can(ChannelAction.Update, channel)) {
        this.channelsService.deleteChannel(Number(body.channel_id));
      } else {
        throw new HttpException('TODO: Unauthorized delete', 400);
      }
    } catch (error) {}
  }

  async broadcastStatusChange(socket: SocketWithUser, status: UserStatus) {
    this.userService.setUserStatus(socket.user.id, status);

    const rels =
      await this.userRelationshipService.getAllUserRelationshipsFromOneUser(
        socket.user.id.toString(),
      );

    // TODO: Filter by relation state
    rels
      .filter((rel) => rel.type & UserRelationshipTypes.friends) //
      .forEach((rel) => {
        const otherId =
          socket.user.id === Number(rel.user1_id) ? rel.user2_id : rel.user1_id;
        this.logger.debug(`Notifying ${otherId}...`);

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
      this.joinChannel(socket, c.channel.id);
      // const channel = `#${c.channel!.id}`;
      // this.logger.log(`User joining ${channel}`);

      // socket.join(channel);
      // // TODO: Check which data to send on join
      // // TODO: Use a status event and set connected as its value
      // socket.to(channel).emit('connected', { username: socket.user.name });
    });

    // Notify friends about status

    this.logger.debug(
      `Client ${socket.user.id} connected with ${
        socket.rooms.size - 2
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
    const roomName = `#${id}`;

    this.server.to(roomName).emit('leaveChannel-back', {
      channel_id: id.toString(),
      user_id: '-1',
    });
    const socketIds = await this.server.in(roomName).allSockets();

    // Force all sockets to leave the deleted room
    socketIds.forEach((socketId) => {
      this.server.sockets.sockets.get(socketId).leave(roomName);
    });
  }

  async joinChannel(socket: SocketWithUser, channel_id: number) {
    const roomName = `#${channel_id}`;
    this.logger.log(`User joining channel ${channel_id}`);

    socket.join(roomName);
    // TODO: Check which data to send on join
    // TODO: Use a status event and set connected as its value
    socket.to(roomName).emit('connected', { username: socket.user.name });
  }
}
