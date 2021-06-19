import { NotFoundException } from '@nestjs/common';
 
export default class ChannelNotFound extends NotFoundException {
  constructor(channelId: number) {
    super(`Channel with id ${channelId} not found`);
  }
}
