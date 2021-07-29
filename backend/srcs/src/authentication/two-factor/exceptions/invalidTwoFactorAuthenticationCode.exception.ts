import { BadRequestException } from '@nestjs/common';

export class InvalidTwoFactorAuthenticationCode extends BadRequestException {
  constructor() {
    super('Invalid authentication code');
  }
}
