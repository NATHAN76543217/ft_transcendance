import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
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

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    user.status = UserStatus.online;
    response.send(user);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Res() response: Response) {
    // It doesn't hurt to reset cookies
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    response.send();
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
