import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class School42AuthenticationGuard extends AuthGuard('school42') {
  handleRequest(err: Error, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (
      info
      && info.message ===
        'The resource owner or authorization server denied the request.'
    )
		  return "failure";
    else if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
