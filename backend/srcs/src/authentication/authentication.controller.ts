import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  Inject,
  forwardRef,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterWithPassword from './dto/registerWithPassword.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import LoginWithPasswordDto from './dto/loginWithPassword.dto';
import { ApiCookieAuth } from '@nestjs/swagger';
import { UserStatus } from 'src/users/utils/userStatus';
import UsersService from 'src/users/users.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import { JwtTwoFactorGuard } from './two-factor/jwt-two-factor.guard';
import { AuthenticationResponseDto } from './dto/authenticationResponse.dto';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  private logger = new Logger('Authentication');
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('registerWithPassword')
  async registerWithPassword(@Body() registrationData: RegisterWithPassword) {
    return this.authenticationService.registerWithPassword(registrationData);
  }
  
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  async logIn(
    @Req() request: RequestWithUser,
    @Body() _: LoginWithPasswordDto,
    @Res() response: Response<AuthenticationResponseDto>,
  ) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );

    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    response.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    if (user.twoFactorAuthEnabled) {
      response.send({ twoFactorAuthEnabled: true });
      return;
    }

    user.password = undefined;
    user.status = UserStatus.online;
    response.send({ user, twoFactorAuthEnabled: false });
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.setFirstConnectionBoolean(request.user.id);
    await this.usersService.removeRefreshToken(request.user.id);

    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );

    response.send();
  }

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  @ApiCookieAuth()
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    user.password = undefined;
    return user;
  }
}
