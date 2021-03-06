import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import UsersModule from './users/users.module';

import { DatabaseModule } from './database/database.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PhotosModule } from './photos/photos.module';
import MatchesModule from './matches/matches.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TerminusModule,
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    ChannelsModule,
    MessagesModule,
    PhotosModule,
    MatchesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
