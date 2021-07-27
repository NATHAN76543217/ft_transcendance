import { forwardRef, Module } from '@nestjs/common';
import ChannelsController from './channels.controller';
import ChannelsService from './channels.service';
import Channel from './channel.entity';
import ChannelRelationship from './relationships/channel-relationship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelRelationshipsService from './relationships/channel-relationships.service';
import { ChannelsGateway } from './channels.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ChannelCaslAbilityFactory } from './channel-casl-ability.factory';
import { Message } from 'src/messages/message.entity';
import { MessagesModule } from 'src/messages/messages.module';
import MessageService from 'src/messages/messages.service';
import UserRelationshipsService from 'src/users/relationships/user-relationships.service';
import UsersModule from 'src/users/users.module';
import UsersService from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelRelationship, Message]),
    AuthenticationModule,
    forwardRef(() => UsersModule),
    MessagesModule,
  ],
  controllers: [ChannelsController],
  providers: [
    MessageService,
    ChannelCaslAbilityFactory,
    ChannelRelationshipsService,
    ChannelsService,
    ChannelsGateway,
  ],
  exports: [ChannelsService]
})
export class ChannelsModule {}
