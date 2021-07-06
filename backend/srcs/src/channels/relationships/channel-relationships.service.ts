import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';

import ChannelRelationship from './channel-relationship.entity';
import ChannelRelationshipNotFound from '../exception/ChannelRelationshipNotFound.exception';
import UpdateChannelRelationshipDto from '../dto/UpdateChannelRelationship.dto';
import CreateChannelRelationshipDto from '../dto/CreateChannelRelationship.dto';

// TODO: I want to remove this service, otherwise make it specific to a channel

@Injectable()
export default class ChannelRelationshipsService {
  constructor(
    @InjectRepository(ChannelRelationship)
    private channelRelationshipsRepository: Repository<ChannelRelationship>,
  ) {}

  async getAllChannelRelationships() {
    const data = await this.channelRelationshipsRepository.find();
    return data;
  }

  async getAllChannelRelationshipsFromChannelId(id: string) {
    const data = await this.channelRelationshipsRepository.find({
      where: [{ channel_id: id + '' }],
    });
    return data;
  }

  // async getUserRelationshipsFilteredByName(name: string) {
  //   let results = this.channelRelationshipsRepository.find({
  //     where: { 'name': Like('%' + name + '%') }});
  //     return results;
  // }

  /* async updateChannelRelationship(
    id: number,
    channelRelationship: UpdateChannelRelationshipDto,
  ) {
    await this.channelRelationshipsRepository.update(id, channelRelationship);
    const updatedChannelRelationship =
      this.channelRelationshipsRepository.findOne(id);
    if (updatedChannelRelationship) {
      return updatedChannelRelationship;
    }
    throw new ChannelRelationshipNotFound(id);
  }

  async createChannelRelationship(
    channelRelationship: CreateChannelRelationshipDto,
  ) {
    const newChannelRelationship =
      this.channelRelationshipsRepository.create(channelRelationship);
    await this.channelRelationshipsRepository.save(newChannelRelationship);
    return newChannelRelationship;
  }

  async deleteChannelRelationship(id: number) {
    const deleteResponse = await this.channelRelationshipsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new ChannelRelationshipNotFound(id);
    }
  } */
}
