import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import UsersService from 'src/users/users.service';
import UserNameAlreadyExistsException from 'src/authentication/exception/UserNameAlreadyExists.exception';
import UserOauthIdNotFoundException from 'src/users/exception/UserOauthIdNotFound.exception';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private logger = new Logger('OAuthGoogle');

  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.OAUTH_GOOGLE_UID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL:
        'https://localhost/api/authentication/oauth2/google/callback',
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      let user = await this.usersService.getUserByGoogleId(profile.id);
      this.logger.debug(user);
      done(null, user);
    } catch (error) {
      if (error instanceof UserOauthIdNotFoundException) {
        let nbTry = 0;
        const nbTryMax = 20;
        while (nbTry < nbTryMax && nbTry >= 0) {
          try {
            if (profile.name.givenName == undefined) {
              throw new UserNameAlreadyExistsException(undefined);
            }
            let name: string = profile.name.givenName.substring(0, 13).toLowerCase();
            if (nbTry) {
              name = name + nbTry;
            }
            this.logger.debug(`Creating user account for '${name}'...`);
            let user = await this.usersService.createUser({
              name: name,
              password: profile.password,
              googleid: profile.id,
            });
            user.password = undefined;
            done(null, user);
            nbTry = -1;
          } catch (e) {
            if (e?.code === PostgresErrorCode.UniqueViolation) {
              // throw new UserNameAlreadyExistsException(profile.login);
            }
            nbTry++;
          }
        }
        if (nbTry === nbTryMax) {
          throw new UserNameAlreadyExistsException(
            profile.name.givenName.substring(0, 13),
          );
        }
      } else {
        this.logger.debug('error');
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
