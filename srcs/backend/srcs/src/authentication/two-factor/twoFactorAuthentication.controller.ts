import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
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
  async register(@Req() request: RequestWithUser, @Res() response: Response) {
    /*   if (request.user.twoFactorAuthEnabled) {
      throw new UnauthorizedException('2FA is already enabled');
    }
 */
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

    Logger.debug(
      `Enabling 2FA for user ${request.user.id}: code: ${twoFactorAuthCode} isCodeValid: ${isCodeValid}`,
    );

    if (!isCodeValid) {
      throw new InvalidTwoFactorAuthenticationCode();
    }

    await this.usersService.enableTwoFactorAuthentication(request.user.id);
  }

  @Post('disable')
  @HttpCode(200)
  async disable(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isCodeValid(
      request.user,
      twoFactorAuthCode,
    );

    Logger.debug(
      `Disabling 2FA for user ${request.user.id}: code: ${twoFactorAuthCode} isCodeValid: ${isCodeValid}`,
    );

    if (!isCodeValid) {
      throw new InvalidTwoFactorAuthenticationCode();
    }

    await this.usersService.disableTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  async authenticate(
    @Req() request: RequestWithUser,
    @Res() response: Response,
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

    response.setHeader('Set-Cookie', [accessTokenCookie]);

    response.send(request.user);
  }
}
