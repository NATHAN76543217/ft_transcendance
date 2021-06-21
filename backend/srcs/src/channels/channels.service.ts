import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Channel from './channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChannelNotFound from './exception/ChannelNotFound.exception';

@Injectable()
export default class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>
  ) {}

  async getAllChannels() {
    const channels = await this.channelsRepository.find({ relations: ['users']});
    return channels;
  }

  async getChannelById(id: number) {
    const channel = await this.channelsRepository.findOne(id, { relations: ['users'] });
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
    const updatedChannel = await this.channelsRepository.findOne(id, { relations: ['users'] });
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
