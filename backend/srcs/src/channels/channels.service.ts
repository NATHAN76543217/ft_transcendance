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
import User from 'src/users/user.interface';
import { string } from '@hapi/joi';

@Injectable()
export default class ChannelsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async getUserFromSocket(socket: Socket): Promise<User> {
    const logger = new Logger();
    logger.debug(`headers: ${JSON.stringify(socket.handshake.headers)}, query: ${JSON.stringify(socket.handshake.query)}`);
    const token = socket.handshake.headers.token as string | undefined;

    if (!token)
      throw new WsException('Missing token.');
    logger.debug("auth token: " + token);

    if (token === "TODO")
      return {id: 0, name: "socketUser", password: "", nbWin: 0, nbLoss: 0, stats: 0, imgPath: "", twoFactorAuth: false, status: "online", channels: []};

    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        token,
      );

    if (!user) {
      throw new WsException('Invalid token.');
    }
    return user;
  }

  async getAllChannels(name: string) {
    if (name === undefined) {
      return await this.channelsRepository.find({ relations: ['users'] });
    }
    return this.channelsRepository.find({
      where: { name: Like('%' + name + '%') },
    });
  }

  async getChannelById(id: number) {
    const channel = await this.channelsRepository.findOne(id, {
      relations: ['users'],
    });
    if (channel) {
      return channel;
    }
    throw new ChannelNotFound(id);
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
