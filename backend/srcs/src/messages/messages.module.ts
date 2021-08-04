import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelCaslAbilityFactory } from 'src/channels/channel-casl-ability.factory';
import { ChannelsModule } from 'src/channels/channels.module';

import { Message } from './message.entity';
import MessagesController from './messages.controller';
import MessageService from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => ChannelsModule)
  ],
  controllers: [MessagesController],
  providers: [MessageService, ChannelCaslAbilityFactory],
  exports: [MessageService]
})
export class MessagesModule { }
