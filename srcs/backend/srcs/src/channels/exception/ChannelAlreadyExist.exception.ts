import { BadRequestException, HttpException } from '@nestjs/common';
 
export default class ChannelAlreadyExistException extends HttpException {
  constructor(channelName: string) {
    super(`The channel '${channelName}' already exists`, 409);
  }
}
