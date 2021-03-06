import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from '@otplib/preset-default';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import User from 'src/users/user.entity';
import UsersService from 'src/users/users.service';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public isCodeValid(user: User, twoFactorAuthCode: string) {
    if (!user.twoFactorAuthSecret) {
      Logger.debug('Two factor auth is disabled...');
      return false;
    }
    Logger.debug(
      `Checking code: ${twoFactorAuthCode}, secret: ${JSON.stringify(user)}`,
    );
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret,
    });
  }

  public async generateSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.name,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
