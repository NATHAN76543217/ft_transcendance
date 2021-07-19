import { BadRequestException, HttpException } from '@nestjs/common';
 
export default class ChannelMandatoryModeException extends HttpException {
  constructor() {
    super(`Channel mode is required`, 406);
  }
}
