import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import axios from 'axios';
import UsersService from 'src/users/users.service';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes';
import UserNameAlreadyExistsException from 'src/authentication/exception/UserNameAlreadyExists.exception';
import UserOauthIdNotFoundException from 'src/users/exception/UserOauthIdNotFound.exception';

@Injectable()
export class School42Strategy extends PassportStrategy(Strategy, 'school42') {
	constructor(private usersService: UsersService) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize?client_id=e2d030a76b4b62d20c5f0ef2b431169b9d845bdb68bfc12dc12d9aa31f215733&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauthentication%2Foauth2%2Fschool42%2Fcallback&response_type=code&scope=public",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: process.env.OAUTH_42_UID,
			clientSecret: process.env.OAUTH_42_SECRET,
			callbackURL: "https://localhost/api/authentication/oauth2/school42/callback",
			scope: 'public',
			proxy: true

			//TODO add state to 42 request
			// state			:	'unguesableString'
		});
	}

	async userProfile(accessToken: any, done: Function) {
		const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		done(null, data);
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
		try {
			let user = await this.usersService.getUserBy42Id(profile.id);
			console.log(user);
			done(null, user);
		}
		catch (error) {
			if (error instanceof UserOauthIdNotFoundException) {
				let nbTry = 0;
				while (nbTry < 20 && nbTry >= 0) {

					try {
						if (profile.login == undefined) {
							throw new UserNameAlreadyExistsException(undefined);
						}
						let name = profile.login.substring(0, 13);
						if (nbTry) {
							name = name + nbTry;
						}
						console.log("Create user account for: ", name, "(school42)");
						let user = await this.usersService.createUser({
							name: name,
							password: profile.password,
							school42id: profile.id
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
			}
			else {
				console.log("error");
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				  );
			}
			// throw error;
		}
	}
}

