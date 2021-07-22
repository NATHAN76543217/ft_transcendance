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

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
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
    @Res() response: Response,
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

    // response.setHeader('Set-Cookie', cookie);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    user.password = undefined;
    user.status = UserStatus.online;
    response.send(user);
    // this.usersGateway.handleConnection()
    // this.usersGateway.server.emit('connection');
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );

    // It doesn't hurt to reset cookies
    response.send();
    // this.usersGateway.server.emit('disconnection');
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiCookieAuth()
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    user.password = undefined;
    return user;
  }
}
