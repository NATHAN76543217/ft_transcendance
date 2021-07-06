import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  SerializeOptions,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { FindOneParam } from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

import ChannelRelationshipsService from './relationships/channel-relationships.service';
import UpdateChannelRelationshipDto from './dto/UpdateChannelRelationship.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ChannelRelationshipTypes } from './relationships/channelRelationshipTypes';
@Controller('channels')
// @UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
/* @SerializeOptions({
  strategy: 'exposeAll',
  // strategy: 'excludeAll'
}) */
export default class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly channelRelationshipsService: ChannelRelationshipsService,
  ) {}

  // TODO: Nobody should be able to read all channels besides admin
  // Maybe this should only get channels with CASL read permissions
  @Get()
  getChannels(@Query('name') name: string) {
    return this.channelsService.getAllChannels(name);
  }

  // TODO: Check if user has a positive relation and CASL read permission
  @Get(':id')
  async getChannelById(@Param() { id }: FindOneParam) {
    return this.channelsService.getChannelById(Number(id));
  }

  // @Get()
  // async getChannelByName(@Query() name: string) {
  //   return this.channelsService.getChannelByName(name);
  // }

  @Post()
  // TODO: Check if user has CASL create permission (any user should be able)
  async createChannel(
    @Req() req: RequestWithUser,
    @Body() channelData: CreateChannelDto,
  ) {
    const channel = await this.channelsService.createChannel(channelData);

    await this.channelsService.createChannelRelationship(
      channel.id,
      req.user.id,
      ChannelRelationshipTypes.owner,
    );
    return channel;
  }

  @Patch(':id')
  // TODO: Check if user has CASL update permission (owner should be able)
  async updateChannel(
    @Param() { id }: FindOneParam,
    @Body() channel: UpdateChannelDto,
  ) {
    return this.channelsService.updateChannel(Number(id), channel);
  }

  @Delete(':id')
  // TODO: Check if user has CASL delete permission
  async deleteChannel(@Param() { id }: FindOneParam) {
    // return this.channelsService.deleteChannel(id);
    return this.channelsService.deleteChannel(Number(id));
  }

  // -----------------------------------
  // ---------- relationships ----------
  // -----------------------------------

  // This should not be neeeded if we get channel users from GET /channels/:id
  /* 
  @Get('relationships/:id')
	async getChannelRelationshipsById(@Param('id') id: string) {
		return this.channelRelationshipsService.getAllChannelRelationshipsFromChannelId(id);
	}
 */

  // In join and leave, the user id can be inferred from the JWT token
  @Post(':id/join')
  async joinChannel(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
  ) {
    const relationship = await this.channelsService.getChannelRelationship(
      Number(channelId),
      req.user.id,
    );

    if (relationship) {
      // If we already have a relationship,
      // we have already joined or are banned from the channel

      // TODO: Improve exception
      throw new HttpException('Relationship already exists!', 400);
    }

    await this.channelsService.createChannelRelationship(
      Number(channelId),
      req.user.id,
      ChannelRelationshipTypes.standard,
    );
  }

  @Delete(':id/leave')
  async leaveChannel(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
  ) {
    return this.channelsService.deleteChannelRelationship(
      Number(channelId),
      req.user.id,
    );
  }

  @Post(':id/invite')

  // Otherwise we need to specify it as a parameter

  // TODO: Check if user has CASL update permission, and if target is owner
  @Patch(':channelId/update/:userId')
  async updateChannelRelationship(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body() channelRelationship: UpdateChannelRelationshipDto,
  ) {
    return this.channelsService.updateChannelRelationship(
      Number(channelId),
      Number(userId),
      channelRelationship.type,
    );

    /* return this.channelRelationshipsService.updateChannelRelationship(
      Number(id),
      channelRelationship,
    ); */
  }
}
