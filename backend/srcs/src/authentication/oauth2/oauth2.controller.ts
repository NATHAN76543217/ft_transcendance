import { Req, Controller, HttpCode, UseGuards, Res, Get, Inject, forwardRef } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import RequestWithUser from '../requestWithUser.interface';
import { Response } from 'express';
import { GoogleAuthenticationGuard } from './google/googleAuthentication.guard';
import { School42AuthenticationGuard } from './school42/school42Authentication.guard';
import UsersService from 'src/users/users.service';


@Controller('authentication/oauth2')
export class Oauth2Controller {
  constructor(
    private authenticationService: AuthenticationService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,) { }

  @Get('school42/callback')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async school42Callback(@Req() request: any, @Res() response: Response) {


    const { user } = request;
    // const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    //TODO make a proper implementation of cookies
    // response.setHeader('Set-Cookie', cookie);

    // const jwt = this.authenticationService.getJwtToken(user.id);
    // response.cookie('Authentication', jwt);

    // const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    // await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

    // response.cookie('Refresh', refreshTokenCookie.token);

    ////////////////////////

    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(user.id);
    const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    try {
      await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

      // response.setHeader('Set-Cookie', cookie);
      request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
      ///////////////////////

      // response.setHeader('Set-Cookie', cookie);
      // request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.token]);

      // response.setHeader('Access-Control-Allow-Origin', "https://localhost/, https://api.intra.42.fr");

      user.password = undefined;

      const first =
        user.imgPath === "default-profile-picture.png" ? "/first" : "";

      response.redirect('https://localhost/login/success' + first);
    } catch (error) {
      response.redirect('https://localhost/login/failure');
    }
  }

  @Get('school42')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async logSchool42() {
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthenticationGuard)
  @HttpCode(200)
  async googleCallback(@Req() req: any, @Res() res: any) {
    console.log("callback google")
    const { user } = req;

    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(user.id);
    const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    try {
      await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

      req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);

      // const jwt = this.authenticationService.getJwtToken(user.id);
      // res.cookie('Authentication', jwt);
      // console.log(jwt);
      user.password = undefined;

      const first =
        user.imgPath === "default-profile-picture.png" ? "/first" : "";

      res.redirect('https://localhost/login/success' + first);
    }
    catch (error) {
      res.redirect('https://localhost/login/failure');
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthenticationGuard)
  @HttpCode(200)
  async logGoogle() {
  }

}