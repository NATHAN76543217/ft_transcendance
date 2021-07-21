import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import UsersService from 'src/users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from './tokenPayload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      // TODO: Remove this for production!
      // ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request?.cookies?.Authentication)
            return request.cookies.Authentication as string;
          return null;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return await this.userService.getUserById(payload.userId);
  }
}
