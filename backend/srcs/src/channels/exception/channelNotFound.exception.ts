import { NotFoundException } from '@nestjs/common';
 
export default class ChannelNotFoundException extends NotFoundException {
  constructor(channelId: number) {
    super(`Channel with id ${channelId} not found`);
  }
}
