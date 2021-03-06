import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import {
  ChannelMessageAction,
  ChannelMessageCaslAbilityFactory,
} from './channel-message-casl-ability.factory';
import UpdateUserInfoDto from 'src/messages/dto/updateUserInfo.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import Message from 'src/messages/message.interface';
import { Events } from './events';

// TODO: Rename to EventsModule...
@Injectable()
@WebSocketGateway(0, { namespace: '/events' })
export class ChannelsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private logger: Logger = new Logger('ChannelsGateway');

  constructor(
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    private readonly channelRelationshipsService: ChannelRelationshipsService,
    private readonly authenticationService: AuthenticationService,
    private readonly messageService: MessageService,
    private readonly abilityFactory: ChannelCaslAbilityFactory,
    private readonly messageAbilityFactory: ChannelMessageCaslAbilityFactory,
    private readonly userRelationshipService: UserRelationshipsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(socket: SocketWithUser) {
    this.logger.debug('Handling incoming connection...');

    try {
      socket.user = await this.authenticationService.getUserFromSocket(socket);
    } catch (e) {
      this.logger.error(`Disconnected: ${e}`);
      socket.disconnect(true);
      return;
    }

    socket.emit(Events.Client.Authenticated);

    socket.on('disconnecting', () => {
      // TODO: set offline status
      this.logger.debug(
        `Client ${socket.user.id} disconnecting with ${socket.rooms.size} joined rooms`,
      );
    });

    this.broadcastStatusChange(socket, UserStatus.online);

    // Join self named channel
    socket.join(socket.user.id.toFixed());
    // Join user channels
    socket.user.channels.forEach((c) => {
      this.connectChannel(socket, c.channel.id);
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
    this.logger.debug('Handling disconnection...');

    if ('user' in socket) {
      await this.onUserDisconnect(socket as SocketWithUser);
      this.logger.debug(
        `Authenticated user ${(socket as SocketWithUser).user.id} disconnected`,
      );
    } else {
      this.logger.debug('Unauthenticated client disconnected');
    }
  }

  @SubscribeMessage(Events.Server.StartGame)
  async handleStatusUpdateAtGameStart(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: { roomId: number },
  ) {
    this.broadcastStatusChange(socket, UserStatus.inGame, body.roomId);
  }

  @SubscribeMessage(Events.Server.EndGame)
  async handleStatusUpdateAtGameEnd(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: { roomId: number },
  ) {
    this.broadcastStatusChange(socket, UserStatus.online);
  }

  @SubscribeMessage(Events.Server.UpdateUserRelation)
  async handleUpdateRelationship(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateRelationshipDto,
  ) {
    const inf = socket.user.id < body.user_id;
    const user1_id = inf ? socket.user.id.toFixed() : body.user_id.toString();
    const user2_id = inf ? body.user_id.toString() : socket.user.id.toFixed();
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
    socket.emit(Events.Client.UpdateUserRelation, {
      user_id: body.user_id.toString(),
      type: body.type,
    });
    socket.to(body.user_id.toString()).emit(Events.Client.UpdateUserRelation, {
      user_id: socket.user.id.toFixed(),
      type: body.type,
    });
  }

  @SubscribeMessage(Events.Server.UpdateUserInfo)
  async handleUpdateUserInfo(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateUserInfoDto,
  ) {
    this.logger.debug('Received event: updateUserInfo-front');

    const user_id = socket.user.id;
    // try {
    // let user;
    // user = await this.usersService.getUserById(user_id);
    // const name = body.name ? body.name : user.name;
    // const imgPath = body.imgPath ? body.imgPath : user.imgPath;
    // this.usersService.updateUser(user.id, {
    //   ...user,
    //   name: name,
    //   imgPath: imgPath,
    // });
    socket.emit(Events.Client.UpdateUserInfo, {
      user_id: user_id,
      name: body.name,
      imgPath: body.imgPath,
    });
    const relations =
      await this.userRelationshipService.getAllUserRelationshipsFromOneUser(
        user_id.toString(),
      );
    relations.forEach((rel) => {
      const friend_id =
        user_id === Number(rel.user1_id) ? rel.user2_id : rel.user1_id;
      socket.to(friend_id.toString()).emit(Events.Client.UpdateUserInfo, {
        user_id: user_id,
        name: body.name,
        imgPath: body.imgPath,
      });
    });
  }

  @SubscribeMessage(Events.Server.UpdateUserRole)
  async handleUpdateRole(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateRoleDto,
  ) {
    try {
      const user = await this.usersService.getUserById(body.user_id);
      delete user.status;
      delete user.roomId;
      this.usersService.updateUser(user.id, {
        ...user,
        role: body.role,
      });
    } catch (error) {
      this.logger.error(error);
    }
    socket.emit(Events.Client.UpdateUserRole, {
      user_id: body.user_id,
      role: body.role,
    });
    socket.to(body.user_id.toString()).emit(Events.Client.UpdateUserRole, {
      user_id: body.user_id,
      role: body.role,
    });
  }

  @SubscribeMessage(Events.Server.UpdateChannelRelation)
  async handleUpdateChannelRelationship(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: UpdateChannelRelationshipDto,
  ) {
    try {
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
        await this.channelRelationshipsService.createChannelRelationship({
          type: body.type,
          channel_id: body.channel_id,
          user_id: body.user_id,
        });
    }
    socket.emit(Events.Client.UpdateChannelRelation, {
      channel_id: body.channel_id.toString(),
      user_id: body.user_id.toString(),
      type: body.type,
    });
    socket
      .to(body.user_id.toString())
      .emit(Events.Client.UpdateChannelRelation, {
        channel_id: body.channel_id.toString(),
        user_id: body.user_id.toString(),
        type: body.type,
      });
  }

  @SubscribeMessage(Events.Server.JoinChannel)
  async handleJoinChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: JoinChannelDto,
  ) {
    this.logger.log('Event received: joinChannel-front');
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

    this.joinChannel(socket, body.channel_id, newType);
    // socket.emit(Events.Client.JoinChannel, {
    //   channel_id: body.channel_id.toString(),
    //   user_id: socket.user.id.toFixed(),
    //   type: newType,
    // });
    // socket
    //   .to(socket.user.id.toFixed())
    //   .emit(Events.Client.JoinChannel, {
    //     channel_id: body.channel_id.toString(),
    //     user_id: socket.user.id.toFixed(),
    //     type: newType,
    //   });
  }

  @SubscribeMessage(Events.Server.LeaveChannel)
  async handleLeaveChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: JoinChannelDto,
  ) {
    this.logger.debug(
      `Event received: leaveChannel-front, payload: ${JSON.stringify(body)}`,
    );

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

      this.leaveChannel(socket, body.channel_id, newType);

      // socket.emit(Events.Client.LeaveChannel, {
      //   channel_id: body.channel_id.toString(),
      //   user_id: socket.user.id.toFixed(),
      //   type: newType,
      // });
      // socket
      //   .to(socket.user.id.toFixed())
      //   .emit(Events.Client.LeaveChannel, {
      //     channel_id: body.channel_id.toString(),
      //     user_id: socket.user.id.toFixed(),
      //     type: newType,
      //   });
    } catch (error) {
      throw new ChannelRelationshipByIdsNotFound(
        body.channel_id,
        socket.user.id,
      );
    }
  }

  @SubscribeMessage(Events.Server.DestroyChannel)
  async handleDestroyChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: DestroyChannelDto,
  ) {
    this.logger.debug('Event received: destroyChannel-front');
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

  async broadcastStatusChange(
    socket: SocketWithUser,
    status: UserStatus,
    roomId?: number,
  ) {
    this.usersService.setUserStatus(socket.user.id, status);
    this.usersService.setUserRoom(socket.user.id, roomId);

    const rels =
      await this.userRelationshipService.getAllUserRelationshipsFromOneUser(
        socket.user.id.toFixed(),
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
          roomId,
        });
      });
  }

  @SubscribeMessage(Events.Server.ChannelMessage)
  async handleMessageChannel(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: CreateMessageDto,
  ) {
    this.logger.debug(
      `Event received: message-channel, payload: ${JSON.stringify(body)}`,
    );
    // const author = socket.user;
    // const channel = socket.user.channels.find((channel) => {
    //   return channel.channel_id === body.channel_id;
    // });
    const channel = await this.channelsService.getChannelById(body.channel_id);
    const author = channel.users.find((user) => {
      return user.user_id === socket.user.id;
    });

    const abilities =
      this.messageAbilityFactory.createForChannelRelationship(author);

    body.receiver_id = 0;
    const roomName = `#${body.channel_id}`;

    if (
      body.type === MessageType.Text &&
      abilities.can(ChannelMessageAction.Create, channel)
    ) {
      const message = await this.messageService.createMessage(
        body,
        socket.user.id,
      );
      this.server.to(roomName).emit(Events.Client.ChannelMessage, message);
      this.logger.debug(`${channel.name}: ${socket.user.name}: ${body.data}`);
    } else {
      this.logger.debug(`${socket.user.name}: ${body.data}`);
    }
  }

  sendUserMessage(
    senderId: number,
    messageDto: CreateMessageDto,
    messageId: number = 0,
  ) {
    const message: Message = {
      channel_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      id: messageId,
      sender_id: Number(senderId),
      receiver_id: Number(messageDto.receiver_id),
      data: messageDto.data,
      type: messageDto.type,
    };

    if (!isNaN(message.receiver_id)) {
      this.server
        .to([
          message.receiver_id.toFixed(),
          message.sender_id.toFixed(),
        ])
        .emit(Events.Client.UserMessage, message);
    }
  }


  @SubscribeMessage(Events.Server.UserMessage)
  async handleMessageUser(
    @ConnectedSocket() socket: SocketWithUser,
    @MessageBody() body: CreateMessageDto,
  ) {
    body.channel_id = 1;
    this.logger.debug(
      `Event received: message-user, payload: ${JSON.stringify(body)}`,
    );

    if (body.type === MessageType.PrivateMessage) {
      const author = socket.user;
      // const channel = await this.channelsService.getChannelById(body.channel_id);
      // const abilities = this.abilityFactory.createForUser(author);

      try {
        const relation =
          await this.userRelationshipService.getUserRelationshipByIds(
            body.receiver_id.toString(),
            socket.user.id.toFixed(),
          );
        if (!(relation.type & UserRelationshipTypes.pending_first_second &&
          relation.type & UserRelationshipTypes.pending_second_first)) {
          return;
        }
      } catch (error) {
        return;
      }

      const message = await this.messageService.createMessage(body, author.id);

      this.server
        .to([body.receiver_id.toFixed(), socket.user.id.toFixed()])
        .emit(Events.Client.UserMessage, message);
    }
  }

  async closeChannel(id: number) {
    const roomName = `#${id}`;

    this.server.to(roomName).emit(Events.Client.LeaveChannel, {
      channel_id: id.toString(),
      user_id: '-1',
    });
    this.server.in(roomName).socketsLeave(roomName);
    
    // const socketIds = await this.server.in(roomName).allSockets();

    // // Force all sockets to leave the deleted room
    // socketIds.forEach((socketId) => {
    //   this.server.sockets.sockets.get(socketId).leave(roomName);
    // });
  }

  async connectChannel(socket: SocketWithUser, channel_id: number) {
    const roomName = `#${channel_id}`;
    this.logger.log(`User connecting to channel ${channel_id}`);

    socket.join(roomName);
  }

  async joinChannel(
    socket: SocketWithUser,
    channel_id: number,
    type: ChannelRelationshipType,
  ) {
    const roomName = `#${channel_id}`;
    this.logger.log(`User joining channel ${channel_id}`);

    socket.join(roomName);
    socket.emit(Events.Client.JoinChannel, {
      channel_id: channel_id,
      user_id: socket.user.id,
      type: type,
    });

    socket.to(roomName).emit(Events.Client.JoinChannel, {
      channel_id: channel_id,
      user_id: socket.user.id,
      type: type,
    });
  }

  async leaveChannel(
    socket: SocketWithUser,
    channel_id: number,
    type: ChannelRelationshipType,
  ) {
    const roomName = `#${channel_id}`;
    this.logger.log(`User leaving channel ${channel_id}`);

    socket.leave(roomName);
    // TODO: Check which data to send on join
    // TODO: Use a status event and set connected as its value
    socket.emit(Events.Client.LeaveChannel, {
      channel_id: channel_id,
      user_id: socket.user.id,
      type: type,
    });

    socket.to(roomName).emit(Events.Client.LeaveChannel, {
      channel_id: channel_id,
      user_id: socket.user.id,
      type: type,
    });
  }
}
