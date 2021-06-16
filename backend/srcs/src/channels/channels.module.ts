import { Module } from '@nestjs/common';
import ChannelsController from './channels.controller';
import ChannelsService from './channels.service';
import Channel from './channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
