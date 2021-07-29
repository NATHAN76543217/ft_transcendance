import { BadRequestException } from '@nestjs/common';

export default class WrongCredentialsException extends BadRequestException {
  constructor() {
    super('Wrong credentials provided');
  }
}
