import { Controller, Get, Post, Put, Patch, Delete, Param, Body, SerializeOptions } from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto }  from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { FindOneParan } from './utils/findOneParams';

@Controller('channels')
@SerializeOptions({
  strategy: 'exposeAll'
})
export default class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  getAllChannels() {
    return this.channelsService.getAllChannels();
  }

  @Get(':id')
  async getChannelById(@Param() { id }: FindOneParan) {
    return this.channelsService.getChannelById(Number(id));
  }

  @Post()
  async createChannel(@Body() channel: CreateChannelDto) {
    return this.channelsService.createChannel(channel);
  }

  @Patch(':id')
  async updateChannel(@Param('id') id: string, @Body() channel: UpdateChannelDto) {
    return this.channelsService.updateChannel(Number(id), channel);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') id:string) {
    return this.channelsService.deleteChannel(Number(id));
  }
}
