import { Injectable, Logger } from '@nestjs/common';
import Channel from './channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import ChannelNotFound from './exception/ChannelNotFound.exception';
import { Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { WsException } from '@nestjs/websockets';
import { ChannelRelationshipTypes } from './relationships/channelRelationshipTypes';
import User from 'src/users/user.entity';
import ChannelRelationship from './relationships/channel-relationship.entity';

@Injectable()
export default class ChannelsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelRelationship)
    private channelRelationshipRepository: Repository<ChannelRelationship>,
  ) {}

  async getUserFromSocket(socket: Socket): Promise<User> {
    const logger = new Logger();
    logger.debug(
      `headers: ${JSON.stringify(
        socket.handshake.headers,
      )}, query: ${JSON.stringify(socket.handshake.query)}`,
    );
    const token = socket.handshake.headers.token as string | undefined;

    if (!token) throw new WsException('Missing token.');
    logger.debug('auth token: ' + token);

    const user =
      await this.authenticationService.getUserFromAuthenticationToken(token);

    if (!user) {
      throw new WsException('Invalid token.');
    }
    return user;
  }

  // TODO: getVisibleChannels instead
  // Admins can see all channels
  async getAllChannels(name: string) {
    if (name === undefined) {
      return await this.channelsRepository.find({ relations: ['users'] });
    }
    return this.channelsRepository.find({
      where: { name: Like('%' + name + '%') },
    });
  }

  async getChannelById(id: number) {
    // Load users relationships
    const channel = await this.channelsRepository.findOne(id, {
      relations: ['users'],
    });

    if (channel) {
      return channel;
    }

    throw new ChannelNotFound(id);
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
    type: ChannelRelationshipTypes,
  ) {
    // This should link user and channel to relation
    const relationship = this.channelRelationshipRepository.create({
      channel_id: channelId,
      user_id: userId,
      type,
    });

    await this.channelRelationshipRepository.save(relationship);
    //await this.channelsRepository
    //  .createQueryBuilder('channel')
    //  .relation(ChannelRelationship, 'user')
    //  .of(channelId)
    //  .add(relationship);
    // TODO: This should maybe be in a transaction to prevent null channel
    //await this.channelRelationshipRepository.save(relationship);
  }

  // TODO: onDelete: CASCADE, maybe even full cascade
  async deleteChannelRelationship(channelId: number, userId: number) {
    await this.channelRelationshipRepository.delete({
      channel_id: channelId,
      user_id: userId,
    });
  }

  async updateChannelRelationship(
    channelId: number,
    userId: number,
    type: ChannelRelationshipTypes,
  ) {
    await this.channelRelationshipRepository
      .createQueryBuilder('channelRelationship')
      .update(ChannelRelationship)
      .set({ type })
      .where('user_id = :userId', { userId })
      .andWhere('channel_id = :channelId', { channelId })
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
    const newChannel = this.channelsRepository.create(channel);
    await this.channelsRepository.save(newChannel);
    return newChannel;
  }

  async updateChannel(id: number, channel: UpdateChannelDto) {
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
    if (!deleteResponse.affected) {
      throw new ChannelNotFound(id);
    }
  }
}
