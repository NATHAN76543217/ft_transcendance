import { Module } from '@nestjs/common';
import ChannelsController from './channels.controller';
import ChannelsService from './channels.service';
import Channel from './channel.entity';
import ChannelRelationship from './relationships/channel-relationship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelRelationshipsService from './relationships/channel-relationships.service';
import { ChannelsGateway } from './channels.gateway';
import { AuthenticationService } from 'src/authentication/authentication.service';
import UsersService from 'src/users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import UsersModule from 'src/users/users.module';
import { config } from 'dotenv';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    TypeOrmModule.forFeature([ChannelRelationship]),
    AuthenticationModule,
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelRelationshipsService,
    ChannelsService,
    ChannelsGateway,
  ],
})
export class ChannelsModule { }
