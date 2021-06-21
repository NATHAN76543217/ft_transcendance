import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2'; 
import User from 'src/users/user.entity';

@Injectable()
export class oauth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
    constructor() {
		super({
			authorizationURL: null,
			tokenURL        : null,
			clientID        : null,
			clientSecret    : null,
			callbackURL     : null,
			scope           : null,
		});
    }
    async validate( accessToken: string ):  Promise<User> {
        return ;
	}
}

