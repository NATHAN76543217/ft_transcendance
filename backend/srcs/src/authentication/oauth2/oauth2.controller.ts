import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, Redirect } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { GoogleAuthenticationGuard } from './google/googleAuthentication.guard';
import { School42AuthenticationGuard } from './school42/school42Authentication.guard';

 
@Controller('authentication/oauth2')
export class Oauth2Controller {
  constructor( ) {}
  
  @Get('school42/callback')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async school42Callback(@Req() req: any, @Res() res:any) {
    console.log("callback school42")
    const jwt: string = req.user.jwt;
    console.log(jwt);
        if (jwt)
            res.redirect('http://localhost:3000/login/success/' + jwt + req.user.name);
        else 
            res.redirect('http://localhost:3000/login/failure');
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
            res.redirect('http://localhost:3000/login/success/' + jwt + req.user.name);
        else 
            res.redirect('http://localhost:3000/login/failure');
  }

  @Get('google')
  @UseGuards(GoogleAuthenticationGuard)
  @HttpCode(200)
  async logGoogle() {
  }

}