import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, SerializeOptions, UseGuards, ClassSerializerInterceptor, UseInterceptors, Res } from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto }  from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { FindOneParam } from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

import ChannelRelationshipsService from './relationships/channel-relationships.service';
import CreateChannelRelationshipDto from './dto/CreateChannelRelationship.dto';
import UpdateChannelRelationshipDto from './dto/UpdateChannelRelationship.dto';

@Controller('channels')
// @UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'exposeAll'
  // strategy: 'excludeAll'
})
export default class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly channelRelationshipsService: ChannelRelationshipsService
    ) {}

  @Get()
  // @UseGuards(JwtAuthenticationGuard)
  getChannels(@Query('name') name: string) {
    return this.channelsService.getAllChannels(name);
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


	// -----------------------------------
	// ---------- relationships ----------
	// -----------------------------------

  @Get('relationships')
	getChannelRelationships() {
		return this.channelRelationshipsService.getAllChannelRelationships();
	}

  @Get('relationships/:id')
	async getChannelRelationshipsById(@Param('id') id: string) {
		return this.channelRelationshipsService.getAllChannelRelationshipsFromChannelId(id);
	}

  @Post('join')
	async createChannelRelationship(@Body() channelRelationship: CreateChannelRelationshipDto) {
		return this.channelRelationshipsService.createChannelRelationship(channelRelationship);
	}

	@Patch('update/:id')
	async updateChannelRelationship(@Param('id') id: string, @Body() channelRelationship: UpdateChannelRelationshipDto) {
		return this.channelRelationshipsService.updateChannelRelationship(Number(id), channelRelationship);
	}

	@Delete('leave/:id')
	async deleteChannelRelationship(@Param('id') id: string) {
		return this.channelRelationshipsService.deleteChannelRelationship(Number(id));
	}

}
