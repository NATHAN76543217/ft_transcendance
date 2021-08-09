import { NotFoundException } from '@nestjs/common';

export default class ChannelRelationshipNotFoundException extends NotFoundException {
  constructor(channelRelationshipId: number) {
    super(`ChannelRelationship with id ${channelRelationshipId} not found`);
  }
}
