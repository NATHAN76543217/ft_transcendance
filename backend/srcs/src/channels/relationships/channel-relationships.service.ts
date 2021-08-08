import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import ChannelRelationship from './channel-relationship.entity';
import UpdateChannelRelationshipDto from '../dto/UpdateChannelRelationship.dto';
import CreateChannelRelationshipDto from '../dto/CreateChannelRelationship.dto';
import ChannelRelationshipByIdsNotFound from '../exception/ChannelRelationshipByIdsNotFound.exception';
import DeleteChannelRelationshipDto from '../dto/DeleteChannelRelationship.dto';

@Injectable()
export default class ChannelRelationshipsService {
  private logger = new Logger('ChannelRelationshipsService');

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

  async getChannelRelationshipByIds(channel_id: number, user_id: number) {
    let channelRelationship = await this.channelRelationshipsRepository.find({
      where: [{ channel_id: channel_id + '', user_id: user_id + '' }],
    });
    if (channelRelationship.length) {
      return channelRelationship[0];
    }
    throw new ChannelRelationshipByIdsNotFound(channel_id, user_id);
  }

  // async getUserRelationshipsFilteredByName(name: string) {
  //   let results = this.channelRelationshipsRepository.find({
  //     where: { 'name': Like('%' + name + '%') }});
  //     return results;
  // }

  async updateChannelRelationship(
    channelRelationship: UpdateChannelRelationshipDto,
  ) {
    let relation = await this.getChannelRelationshipByIds(
      channelRelationship.channel_id,
      channelRelationship.user_id,
    );
    await this.channelRelationshipsRepository.update(
      relation,
      channelRelationship,
    );
    const updatedChannelRelationship = await this.getChannelRelationshipByIds(
      channelRelationship.channel_id,
      channelRelationship.user_id,
    );
    if (updatedChannelRelationship) {
      return updatedChannelRelationship;
    }
    throw new ChannelRelationshipByIdsNotFound(
      channelRelationship.channel_id,
      channelRelationship.user_id,
    );
  }

  async createChannelRelationship(
    channelRelationship: CreateChannelRelationshipDto,
  ) {
    const newChannelRelationship =
      this.channelRelationshipsRepository.create(channelRelationship);
    await this.channelRelationshipsRepository.save(newChannelRelationship);
    return newChannelRelationship;
  }

  async deleteChannelRelationship(
    channelRelationship: DeleteChannelRelationshipDto,
  ) {
    let relation = await this.getChannelRelationshipByIds(
      channelRelationship.channel_id,
      channelRelationship.user_id,
    );
    const deleteResponse = await this.channelRelationshipsRepository.delete({
      channel_id: relation.channel_id,
      user_id: relation.user_id,
    });

    this.logger.debug(`deleteRelationship: deleteResponse: `, JSON.stringify(deleteResponse));

    if (!deleteResponse.affected) {
      throw new ChannelRelationshipByIdsNotFound(
        channelRelationship.channel_id,
        channelRelationship.user_id,
      );
    }
  }
}
