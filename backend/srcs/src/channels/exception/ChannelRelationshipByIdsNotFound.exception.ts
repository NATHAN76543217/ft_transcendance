import { NotFoundException } from '@nestjs/common';

export default class ChannelRelationshipByIdsNotFound extends NotFoundException {
    constructor(channel_id: number, user_id: number) {
    super(`UserRelationship with channel id ${channel_id} and user id ${user_id} not found`);
  }
}
