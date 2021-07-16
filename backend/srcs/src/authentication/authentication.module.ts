import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import UsersModule from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { School42Strategy } from './oauth2/school42/school42.strategy';
import { GoogleStrategy } from './oauth2/google/google.strategy';
import { Oauth2Controller } from './oauth2/oauth2.controller';
import UsersService from 'src/users/users.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        verifyOptions: {
          ignoreExpiration: true, // TODO: Remove in production!
        },
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    School42Strategy,
    GoogleStrategy,
  ],
  controllers: [AuthenticationController, Oauth2Controller],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
