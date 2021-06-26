import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import UsersService from 'src/users/users.service';
import UserNameAlreadyExistsException from 'src/authentication/exception/UserNameAlreadyExists.exception';
import UserOauthIdNotFoundException from 'src/users/exception/UserOauthIdNotFound.exception';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor( private usersService : UsersService ) {
    super({
      clientID: process.env.OAUTH_GOOGLE_UID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: 'http://localhost:8080/authentication/oauth2/google/callback',
    //   callbackURL: 'https://localhost/api/authentication/oauth2/google/callback',
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const jwt = "jwt placeholder";
    try {
      let user = await this.usersService.getUserByGoogleId(profile.id);
      user.jwt = jwt;
      console.log(user);
      done(null, user);
    }
    catch (error)
    {
      if (error instanceof UserOauthIdNotFoundException )
      {
        console.log("Create user account for: ", profile.name.givenName, "(google)");
        if (profile.name.givenName == undefined)
          throw new UserNameAlreadyExistsException(undefined);
        let user = await this.usersService.createUser({
          name: profile.name.givenName,
          password: profile.password,
          googleid: profile.id
        });
        user.jwt = jwt;
        user.password = undefined;
        done(null, user);
      }
      else if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserNameAlreadyExistsException(profile.login);
        //TODO handle this error then ask for user enter a custom name
      }
      else {
        console.log("error");
        done(error, false);
        // throw error;
      }
    } 
  }
}