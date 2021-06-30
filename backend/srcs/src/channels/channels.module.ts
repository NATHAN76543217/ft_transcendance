import { Module } from '@nestjs/common';
import ChannelsController from './channels.controller';
import ChannelsService from './channels.service';
import Channel from './channel.entity';
import ChannelRelationship from './relationships/channel-relationship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelRelationshipsService from './relationships/channel-relationships.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    TypeOrmModule.forFeature([ChannelRelationship]),
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    ChannelRelationshipsService,
  ],
  exports: [
    ChannelsService,
    ChannelRelationshipsService
  ]
})
export class ChannelsModule { }
