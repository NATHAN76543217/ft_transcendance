import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import UsersModule from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { School42Strategy } from './oauth2/school42/school42.strategy';
import { GoogleStrategy } from './oauth2/google/google.strategy';
import { Oauth2Controller } from './oauth2/oauth2.controller';
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy';
import { TwoFactorAuthenticationController } from './two-factor/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './two-factor/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './two-factor/jwt-two-factor.strategy';

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
    JwtRefreshTokenStrategy,
    School42Strategy,
    GoogleStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  controllers: [
    AuthenticationController,
    Oauth2Controller,
    TwoFactorAuthenticationController,
  ],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
