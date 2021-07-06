import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import User from '../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }
  async validate(name: string, password: string): Promise<User> {
    //Logger.debug(`Login validating ${name}, ${password}`);

    //REVIEW change function name?
    return this.authenticationService.getAuthenticatedUserWithPassword(
      name,
      password,
    );
  }
}
