import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import User from '../users/user.entity';
import { UserRoleTypes } from 'src/users/utils/userRoleTypes';
import { UserBannedException } from './exception/UserBanned.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }
  async validate(name: string, password: string): Promise<User> {
    //REVIEW change function name?
    const user = await this.authenticationService.getAuthenticatedUserWithPassword(
      name,
      password,
    );

    if (user.role & UserRoleTypes.ban) {
      throw new UserBannedException();
    }

    return user;
  }
}
