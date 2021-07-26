import { BadRequestException, HttpException } from '@nestjs/common';
 
export default class ChannelMandatoryPasswordException extends HttpException {
  constructor() {
    super(`Need password: protected channel`, 402);
  }
}
