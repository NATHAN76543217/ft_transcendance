import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Channel from './channel.entity';
import { CreateChannelDto } from './dto/createChannel';
import { UpdateChannelDto } from './dto/updateChannel';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>
  ) {}

  getAllChannels() {
    return this.channelsRepository.find();
  }

  getChannelById(id: number) {
    const channel = this.channelsRepository.findOne(id);
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
  }

  async createChannel(channel: CreateChannelDto) {
    const newChannel = await this.channelsRepository.create(channel);
    await this.channelsRepository.save(newChannel);
    return newChannel;
  }

  async updateChannel(id: number, channel: UpdateChannelDto) {
    await this.channelsRepository.update(id, channel);
    const updatedChannel = this.channelsRepository.findOne(id);
    if (updatedChannel) {
      return updatedChannel;
    }
    throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
  }

  async deleteChannel(id: number) {
    const deleteResponse = await this.channelsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    }
  }
}
