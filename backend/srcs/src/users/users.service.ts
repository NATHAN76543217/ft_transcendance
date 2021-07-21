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
import { UsersGateway } from './users.gateway';
import { UserRoleTypes } from './utils/userRoleTypes';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthenticationService))
    private authenticationService: AuthenticationService,
    @Inject(forwardRef(() => UsersGateway))
    private readonly usersGateway: UsersGateway,
  ) { }

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
      console.log(error)
    }
  }


  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getUserById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }


  async getAllUsers(name: string) {
    // const user = await this.getUserById(1);
    // this.updateUser(1, {
    //   ...user,
    //   role: UserRoleTypes.owner})

    if (name === undefined) {
      return await this.usersRepository.find({
        relations: ['channels', 'channels.channel'],
        order: { name: 'ASC' },
      });
    }
    return this.usersRepository.find({
      where: { name: Like('%' + name + '%') },
    });
  }

  // withChannels option joins channels and preview data
  async getUserById(id: number, withChannels = false) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id }); // Select user with id

    if (withChannels) this.joinChannels(query);
    const user = await query.getOne();

    if (user) return user;

    throw new UserNotFound(id);
  }

  private joinChannels(query: SelectQueryBuilder<User>): void {
    query
      .leftJoin('user.channels', 'channelRelation')
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

  async getUsersFiltertByName(name: string) {
    const results = this.usersRepository.find({
      where: { name: Like('%' + name + '%') },
    });
    return results;
  }

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
    await this.usersRepository.update(id, user);
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
    const nbUsers = await this.usersRepository.count()
    if (!nbUsers) {
      newUser.role = UserRoleTypes.owner;
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
    } catch (error) { }

    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFound(Number(id));
    }
  }


  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: currentHashedRefreshToken
      // currentHashedRefreshToken
    });
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

}
