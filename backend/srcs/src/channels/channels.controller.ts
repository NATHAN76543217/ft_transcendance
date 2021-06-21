import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, SerializeOptions, UseGuards, ClassSerializerInterceptor, UseInterceptors, Res } from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto }  from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { FindOneParam } from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('channels')
// @UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'exposeAll'
  // strategy: 'excludeAll'
})
export default class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  async getAllChannels() {
    return this.channelsService.getAllChannels();
  }

  @Get(':id')
  // @UseGuards(JwtAuthenticationGuard)
  async getChannelById(@Param() { id }: FindOneParam) {
    return this.channelsService.getChannelById(Number(id));
  }

  // @Get()
  // async getChannelByName(@Query() name: string) {
  //   return this.channelsService.getChannelByName(name);
  // }

  @Post()
  // @UseGuards(JwtAuthenticationGuard)
  async createChannel(@Body() channel: CreateChannelDto) {
    return this.channelsService.createChannel(channel);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthenticationGuard)
  async updateChannel(@Param() { id }: FindOneParam, @Body() channel: UpdateChannelDto) {
    return this.channelsService.updateChannel(Number(id), channel);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthenticationGuard)
  async deleteChannel(@Param() { id }: FindOneParam) {
    // return this.channelsService.deleteChannel(id);
    return this.channelsService.deleteChannel(Number(id));
  }
}
