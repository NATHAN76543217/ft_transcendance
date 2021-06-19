import { NotFoundException } from '@nestjs/common';
 
export default class ChannelNameNotFoundException extends NotFoundException {
  constructor(channelName: string) {
    super(`Channel with name ${channelName} not found`);
  }
}
