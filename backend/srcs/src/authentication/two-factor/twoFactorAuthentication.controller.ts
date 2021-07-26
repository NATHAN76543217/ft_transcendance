import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import UsersService from 'src/users/users.service';
import { AuthenticationService } from '../authentication.service';
import JwtAuthenticationGuard from '../jwt-authentication.guard';
import RequestWithUser from '../requestWithUser.interface';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { InvalidTwoFactorAuthenticationCode } from './exceptions/invalidTwoFactorAuthenticationCode.exception';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get('generate')
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateSecret(request.user);

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }

  @Post('enable')
  @HttpCode(200)
  async enable(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isCodeValid(
      request.user,
      twoFactorAuthCode,
    );

    if (!isCodeValid) {
      throw new InvalidTwoFactorAuthenticationCode();
    }

    await this.usersService.enableTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isCodeValid(
      request.user,
      twoFactorAuthCode,
    );

    if (!isCodeValid) {
      throw new InvalidTwoFactorAuthenticationCode();
    }

    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      request.user.id,
      true,
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
