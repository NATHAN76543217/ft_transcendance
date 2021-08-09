import { BadRequestException, HttpException } from '@nestjs/common';
 
export default class ChannelWrongPasswordException extends HttpException {
  constructor() {
    super(`Wrong password`, 401);
  }
}
