import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import Channel from './channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import ChannelNotFound from './exception/ChannelNotFound.exception';
import { Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { WsException } from '@nestjs/websockets';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import User from 'src/users/user.interface';
import ChannelRelationship from './relationships/channel-relationship.entity';
import { ChannelsGateway } from './channels.gateway';
import { ChannelMode } from './utils/channelModeTypes';
import ChannelMandatoryPassword from './exception/ChannelMandatoryPassword.exception';
import ChannelAlreadyExist from './exception/ChannelAlreadyExist.exception';
import ChannelMandatoryMode from './exception/ChannelMandatoryMode.exception';
import * as bcrypt from 'bcrypt';
import ChannelWrongPassword from './exception/ChannelWrongPassword.exception';
import { Message } from 'src/messages/message.entity';
import { parse } from 'cookie';

@Injectable()
export default class ChannelsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelRelationship)
    private readonly channelRelationshipRepository: Repository<ChannelRelationship>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => ChannelsGateway))
    private readonly channelsGateway: ChannelsGateway,
  ) {}

  async getUserFromSocket(socket: Socket, withChannels = true): Promise<User> {
    const cookie = socket.handshake.headers.cookie ?? '';
    const { Authentication: token } = parse(cookie);

    if (!token) throw new WsException('Missing token.');

    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        token,
        withChannels,
      );

    if (!user) {
      throw new WsException('Invalid token.');
    }
    return user;
  }

  // TODO: getVisibleChannels instead
  // Admins can see all channels
  async getAllChannels(name: string) {
    if (name === undefined) {
      //   const channels = await this.channelsRepository.createQueryBuilder("channel")
      // .leftJoinAndMapOne("channel.relationshipType", "channels.users", "relationshipType", "user.id = user_id")
      // .where("channel.name = :name", { name: name })
      // .getOne();

      // return channels

      return await this.channelsRepository.find({ relations: ['users'] });
    }
    return this.channelsRepository.find({
      where: { name: Like('%' + name + '%') },
    });
  }

  // async getChannelById(id: number) {
  //   // Load users relationships
  //   const channel = await this.channelsRepository.findOne(id, {
  //     relations: ['users'],
  //   });

  //   if (channel) {
  //     return channel;
  //   }

  //   throw new ChannelNotFound(id);
  // }

  async getChannelById(id: number) {
    // Load users relationships
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .leftJoin('users.user', 'channelUser')
      .addSelect('channelUser.name')
      .where('channel.id = :id', { id: id })
      .getOne();

    // .findOne(id, {
    //   relations: ['users'],
    // });

    if (channel) {
      return channel;
    }

    throw new ChannelNotFound(id);
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new ChannelWrongPassword();
    }
  }

  async getMessagesById(
    channelId: number,
    beforeId?: number,
    afterId?: number,
  ) {
    const maxCount = 20;

    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.channel_id = :channelId', { channelId })
      .orderBy('message.created_at', 'ASC') // TODO: Set ASC or DESC
      .take(maxCount);

    if (beforeId !== undefined && !isNaN(beforeId))
      query.andWhere('message.id < :beforeId', { beforeId });
    if (afterId !== undefined && !isNaN(afterId))
      query.andWhere('message.id > :afterId', { afterId });

    return query.getMany();
  }

  // TODO: Rename all functions to exclude service name and provide uesful info
  async getChannelRelationship(channelId: number, userId: number) {
    return await this.channelRelationshipRepository.findOne({
      channel_id: channelId,
      user_id: userId,
    });

    // TODO: Maybe use getOneOrFail instead for proper exceptions
  }

  // This should not be called with an existing relationship.
  async createChannelRelationship(
    channelId: number,
    userId: number,
    type: ChannelRelationshipType,
  ) {
    // This should link user and channel to relation
    const relationship = this.channelRelationshipRepository.create({
      channel_id: channelId,
      user_id: userId,
      type: type,
    });

    await this.channelRelationshipRepository.save(relationship);
    //await this.channelsRepository
    //  .createQueryBuilder('channel')
    //  .relation(ChannelRelationship, 'user')
    //  .of(channelId)
    //  .add(relationship);
    // TODO: This should maybe be in a transaction to prevent null channel
    //await this.channelRelationshipRepository.save(relationship);

    return relationship;
  }

  // TODO: onDelete: CASCADE, maybe even full cascade
  async deleteChannelRelationship(channelId: number, userId: number) {
    await this.channelRelationshipRepository.delete({
      channel_id: channelId,
      user_id: userId,
    });
  }

  async updateChannelRelationship(
    channel_id: number,
    user_id: number,
    type: ChannelRelationshipType,
  ) {
    await this.channelRelationshipRepository
      .createQueryBuilder('channelRelationship')
      .update(ChannelRelationship)
      .set({ type: type })
      .where('user_id = :user_id', { user_id })
      .andWhere('channel_id = :channel_id', { channel_id })
      .execute();
  }
  // async getChannelByName(name: string) {
  //   const channel = await this.channelsRepository.findOne(name, { relations: ['users'] });
  //   if (channel) {
  //     return channel;
  //   }
  //   throw new ChannelNameNotFound(name);
  // }

  async createChannel(channel: CreateChannelDto) {
    if (channel.mode === null) {
      throw new ChannelMandatoryMode();
    }
    if (
      Number(channel.mode) === Number(ChannelMode.protected) &&
      (channel.password === '' || channel.password === undefined)
    ) {
      throw new ChannelMandatoryPassword();
      // throw new HttpException('TODO: Unauthorized read', 401);
    }
    if (Number(channel.mode) !== Number(ChannelMode.protected)) {
      channel.password = '';
    } else {
      const hashedPassword = await bcrypt.hash(channel.password, 10);
      channel.password = hashedPassword;
    }
    try {
      const newChannel = this.channelsRepository.create(channel);
      await this.channelsRepository.save(newChannel);
      return newChannel;
    } catch (error) {
      if (Number(error.code) === 23505) {
        throw new ChannelAlreadyExist(channel.name);
      } else {
        throw new HttpException('Error at channel creation', 400);
      }
    }
  }

  async updateChannel(id: number, channel: UpdateChannelDto) {
    if (
      Number(channel.mode) === Number(ChannelMode.protected) &&
      (channel.password === '' || channel.password === undefined)
    ) {
      throw new ChannelMandatoryPassword();
      // throw new HttpException('TODO: Unauthorized read', 401);
    }
    if (Number(channel.mode) !== Number(ChannelMode.protected)) {
      channel.password = '';
    } else {
      const hashedPassword = await bcrypt.hash(channel.password, 10);
      channel.password = hashedPassword;
    }
    await this.channelsRepository.update(id, channel);
    const updatedChannel = await this.channelsRepository.findOne(id, {
      relations: ['users'],
    });
    if (updatedChannel) {
      return updatedChannel;
    }
    throw new ChannelNotFound(id);
  }

  async deleteChannel(id: number) {
    const deleteResponse = await this.channelsRepository.delete(id);

    // TODO: Dispatch leave event on corresponding gateway room

    if (!deleteResponse.affected) {
      throw new ChannelNotFound(id);
    }

    await this.channelsGateway.closeChannel(id);
  }
}
