import { forwardRef, Global, Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import UserRelationship from './relationships/user-relationship.entity';
import UserRelationshipsService from './relationships/user-relationships.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MessagesModule } from 'src/messages/messages.module';
import MessageService from 'src/messages/messages.service';
import { Message } from 'src/messages/message.entity';
import { ChannelsModule } from 'src/channels/channels.module';
import Channel from 'src/channels/channel.entity';
import ChannelsService from 'src/channels/channels.service';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import { ChannelsGateway } from 'src/channels/channels.gateway';
import ChannelRelationshipsService from 'src/channels/relationships/channel-relationships.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRelationship, Message]),
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ChannelsModule),
    MessagesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRelationshipsService,
    ],
  exports: [UsersService, UserRelationshipsService],
})
export default class UsersModule {}
