import { UnauthorizedException } from '@nestjs/common';

export class InvalidTwoFactorAuthenticationCode extends UnauthorizedException {
  constructor() {
    super('Invalid authentication code');
  }
}
