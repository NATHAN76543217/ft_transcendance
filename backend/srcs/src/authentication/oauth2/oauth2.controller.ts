import { Req, Controller, HttpCode, UseGuards, Res, Get } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import RequestWithUser from '../requestWithUser.interface';
import { Response } from 'express';
import { GoogleAuthenticationGuard } from './google/googleAuthentication.guard';
import { School42AuthenticationGuard } from './school42/school42Authentication.guard';


@Controller('authentication/oauth2')
export class Oauth2Controller {
  constructor(private authenticationService: AuthenticationService) { }

  @Get('school42/callback')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async school42Callback(@Req() request: any, @Res() response: Response) {


    const { user } = request;
    // const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    //TODO make a proper implementation of cookies
    // response.setHeader('Set-Cookie', cookie);
    const jwt = this.authenticationService.getJwtToken(user.id);
    response.cookie('Authentication', jwt);
    // response.setHeader('Access-Control-Allow-Origin', "https://localhost/, https://api.intra.42.fr");

    try {
      user.password = undefined;
      response.redirect('https://localhost/login/success/');
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
    const jwt = this.authenticationService.getJwtToken(user.id);
    res.cookie('Authentication', jwt);
    // console.log(jwt);
    try {
      user.password = undefined;
      res.redirect('https://localhost/login/success');
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