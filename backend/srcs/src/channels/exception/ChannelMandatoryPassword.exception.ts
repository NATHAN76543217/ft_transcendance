import { BadRequestException, HttpException } from '@nestjs/common';
 
export default class ChannelMandatoryPasswordException extends HttpException {
  constructor() {
    super(`Password is required for protected channels`, 402);
  }
}
