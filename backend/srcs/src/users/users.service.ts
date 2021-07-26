import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import User from './user.entity';
import UpdateUserDto from './dto/UpdateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, SelectQueryBuilder } from 'typeorm';
import UserNotFound from './exception/UserNotFound.exception';
import UserOauthIdNotFound from './exception/UserOauthIdNotFound.exception';
import UserRelationshipsService from './relationships/user-relationships.service';
import UserNameNotFoundException from './exception/UserNameNotFound.exception';
import UserRelationship from './relationships/user-relationship.entity';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UserRole } from './utils/userRole';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import * as bcrypt from 'bcrypt';
import UserNameInvalid from './exception/UserNameNotFound.exception';
import { ChannelRelationshipType } from 'src/channels/relationships/channel-relationship.type';
import { UserStatus } from './utils/userStatus';
import { Message } from 'src/messages/message.entity';
import ChannelsService from 'src/channels/channels.service';
import { ChannelMode } from 'src/channels/utils/channelModeTypes';

@Injectable()
export default class UsersService {
  private userStates = new Map<number, UserStatus>();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthenticationService))
    private authenticationService: AuthenticationService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
  ) {}
  setUserStatus(userId: number, status: UserStatus) {
    if (status !== UserStatus.null || !this.userStates.delete(userId))
      this.userStates.set(userId, status);
  }

  getUserStatus(userId: number) {
    return this.userStates.get(userId) || UserStatus.offline;
  }

  private joinUserStatus(user: User) {
    user.status = this.getUserStatus(user.id);
  }
  async enableTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthEnabled: true,
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthSecret: secret,
    });
  }

  async getUserFromSocket(socket: Socket): Promise<User> {
    const logger = new Logger();
    logger.debug(
      `headers: ${JSON.stringify(
        socket.handshake.headers,
      )}, query: ${JSON.stringify(socket.handshake.query)}`,
    );
    const cookie = socket.handshake.headers.cookie ?? '';
    const { Authentication: token } = parse(cookie);

    if (!token) throw new WsException('Missing token.');
    logger.debug('auth token: ' + token);

    try {
      const user =
        await this.authenticationService.getUserFromAuthenticationToken(token);
      if (!user) {
        throw new WsException('Invalid token.');
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getAllUsers(name: string) {
    let users: User[];

    if (!name) {
      users = await this.usersRepository.find({
        relations: ['channels', 'channels.channel'],
        order: { name: 'ASC' },
      });
    } else {
      users = await this.usersRepository.find({
        where: { name: Like('%' + name + '%') },
      });
    }

    users.forEach((user) => this.joinUserStatus(user));

    return users;
  }

  // withChannels option joins channels and preview data
  async getUserById(id: number, withChannels = false) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id }); // Select user with id

    if (withChannels) this.joinChannels(query);
    const user = await query.getOne();

    if (user) {
      user.status = this.getUserStatus(user.id);
      if (user.channels) {
        let len = user.channels.length;
        while (--len >= 0) {
          if (user.channels[len].type === ChannelRelationshipType.Banned) {
            user.channels.splice(len, 1);
          }
        }
      }
      return user;
    }
    throw new UserNotFound(id);
  }

  private joinChannels(query: SelectQueryBuilder<User>): void {
    query
      .leftJoin('user.channels', 'channelRelation')
      // .where('channelRelation.type != :banned', {banned: ChannelRelationshipType.Banned})
      .addSelect('channelRelation.type')
      .addSelect('channelRelation.last_read_message_id', 'last_read_message_id')
      .leftJoin('channelRelation.channel', 'channel')
      .addSelect('channel')
      .loadRelationCountAndMap(
        'channelRelation.unread_messages_count',
        'channel.messages',
        'message',
        (qb) =>
          qb
            .from(ChannelRelationship, 'channelRelation')
            .where('message.id > channelRelation.last_read_message_id'),
      )
      //.addSelect('channelRelation.unread_messages_count')
      .leftJoin('channel.users', 'channelUserRelation')
      .addSelect('channelUserRelation.type')
      .leftJoin('channelUserRelation.user', 'channelUser')
      .addSelect(['channelUser.id', 'channelUser.name', 'channelUser.imgPath']);
  }

  async getUserByName(
    name: string,
    withPassword = false,
    withChannels = false,
  ) {
    // This should never be false
    //if (name !== undefined)
    // const user = await this.usersRepository.findOne(name, { relations: ['channels'] });

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.name = :name', { name });

    if (withPassword) query.addSelect('user.password');
    if (withChannels) this.joinChannels(query);
    try {
      const user = await query.getOne();

      if (user) return user;
    } catch (e) {
      Logger.error(e);
    }

    throw new UserNameNotFoundException(name);
  }

  /* async getUsersFiltertByName(name: string) {
    const results = await this.usersRepository.find({
      where: { name: Like('%' + name + '%') },
    });

    Logger.debug('Log');

    results.forEach(this.joinUserStatus);

    return results;
  } */

  async getUserBy42Id(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        school42id: id,
      },
    });
    if (user) return user;
    else throw new UserOauthIdNotFound(id);
  }

  async getUserByGoogleId(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        googleid: id,
      },
    });
    if (user) return user;
    else throw new UserOauthIdNotFound(id);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, user);
    } catch (e) {
      throw new UserNameInvalid(user.name);
    }
    const updatedUser = this.usersRepository.findOne(id, {
      relations: ['channels', 'channels.channel'],
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFound(id);
  }

  async createUser(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    const nbUsers = await this.usersRepository.count();
    if (!nbUsers) {
      newUser.role = UserRole.Owner;
      this.channelsService.createChannel({
        name: 'private_users',
        password: 'Users_private_SecreT',
        mode: ChannelMode.users,
      });
    }
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(
    id: string,
    userRelationshipsService: UserRelationshipsService,
  ) {
    try {
      const dataRel =
        await userRelationshipsService.getAllUserRelationshipsFromOneUser(id);
      if (dataRel) {
        dataRel.map((relation: UserRelationship) => {
          userRelationshipsService.deleteUserRelationship(Number(relation.id));
        });
      }
    } catch (error) {}

    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFound(Number(id));
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: currentHashedRefreshToken,
      // currentHashedRefreshToken
    });
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getMessagesById(
    user1_id: number,
    user2_id: number,
    beforeId?: number,
    afterId?: number,
  ) {
    const maxCount = 20;

    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.receiver_id = :user1_id', { user1_id })
      .andWhere('message.sender_id = :user2_id', { user2_id })
      .orWhere('message.receiver_id = :user2_id', { user2_id })
      .andWhere('message.sender_id = :user1_id', { user1_id })
      // .andWhere('message.type = :type', { type: MessageType.PrivateMessage })
      .orderBy('message.created_at', 'ASC') // TODO: Set ASC or DESC
      .take(maxCount);

    if (beforeId !== undefined && !isNaN(beforeId))
      query.andWhere('message.id < :beforeId', { beforeId });
    if (afterId !== undefined && !isNaN(afterId))
      query.andWhere('message.id > :afterId', { afterId });

    return query.getMany();
  }
}
