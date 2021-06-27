import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, Redirect } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import RequestWithUser from '../requestWithUser.interface';
import { Response } from 'express';
import { GoogleAuthenticationGuard } from './google/googleAuthentication.guard';
import { School42AuthenticationGuard } from './school42/school42Authentication.guard';

 
@Controller('authentication/oauth2')
export class Oauth2Controller {
  constructor( private authenticationService : AuthenticationService ) {}
  
  @Get('school42/callback')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async school42Callback(@Req() request: RequestWithUser, @Res() response: Response) {
    const cookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
    response.setHeader('Set-Cookie', cookie);
    response.setHeader('Access-Control-Allow-Origin', "https://localhost/");
    const { user } = request;
    user.password = undefined;
    return response.send(user);
    // if (cookie)
    //     response.redirect('https://localhost/login/success/');
    // else 
    //     response.redirect('https://localhost/login/failure');
  }

  @Get('school42')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async logSchool42() {
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthenticationGuard)
  @HttpCode(200)
  async googleCallback(@Req() req: any, @Res() res:any) {
    console.log("callback google")
    const jwt: string = req.user.jwt;
    console.log(jwt);
        if (jwt)
            res.redirect('https://localhost/login/success/' + jwt + req.user.name);
        else 
            res.redirect('https://localhost/login/failure');
  }

  @Get('google')
  @UseGuards(GoogleAuthenticationGuard)
  @HttpCode(200)
  async logGoogle() {
  }

}