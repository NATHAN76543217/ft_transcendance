import { NotFoundException } from '@nestjs/common';
 
export default class channelNameNotFoundException extends NotFoundException {
  constructor(channelName: string) {
    super(`Channel with name ${channelName} not found`);
  }
}
