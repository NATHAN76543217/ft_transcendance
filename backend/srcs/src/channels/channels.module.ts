import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelRelationship, Message]),
    AuthenticationModule,
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelCaslAbilityFactory,
    ChannelRelationshipsService,
    ChannelsService,
    ChannelsGateway,
  ],
})
export class ChannelsModule {}
