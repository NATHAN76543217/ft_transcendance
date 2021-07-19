import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

import UpdateChannelRelationshipDto from './dto/UpdateChannelRelationship.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import {
  ChannelAction,
  ChannelCaslAbilityFactory,
} from './channel-casl-ability.factory';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { join } from 'path';
import { ChannelModeTypes } from './utils/channelModeTypes';
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
    private readonly abilityFactory: ChannelCaslAbilityFactory,
  ) { }

  // TODO: Nobody should be able to read all channels besides admin
  // Maybe this should only get channels with CASL read permissions
  @Get()
  //@UseGuards(PoliciesGuard)
  //@CheckPolicies(new ReadChannelPolicyHandler())
  getChannels(
    // @Req() req: RequestWithUser,
    @Query('name') name: string) {
    return this.channelsService.getAllChannels(name);
  }

  // TODO: Check if user has a positive relation and CASL read permission
  @Get(':id')
  async getChannelById(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
  ) {
    const channel = await this.channelsService.getChannelById(
      Number(channelId),
    );
    const abilities = this.abilityFactory.createForUser(req.user);

    if (abilities.can(ChannelAction.Read, channel)) return channel;
    throw new HttpException('TODO: Unauthorized read', 400);
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
    // console.log(channel)
    const relation = await this.channelsService.createChannelRelationship(
      channel.id,
      req.user.id,
      ChannelRelationshipType.owner,
    );
    // console.log(relation)
    return channel;
  }


  // TODO: Check if user has CASL update permission, and if target is owner
  // @Patch('update')
  @Patch(':channelId/update/:userId')
  async updateChannelRelationship(
    @Req() req: RequestWithUser,
    @Param('channelId') channel_id: string,
    @Param('userId') user_id: string,
    @Body() channelRelationship: UpdateChannelRelationshipDto,
  ) {
    const channel = await this.channelsService.getChannelById(
      Number(channel_id),
    );

    const abilities = this.abilityFactory.createForUser(req.user);

    if (abilities.can(ChannelAction.Update, channel))
      return this.channelsService.updateChannelRelationship(
        Number(channel_id),
        Number(user_id),
        channelRelationship.type,
      );
    throw new HttpException('TODO: Unauthorized update', 400);
  }

  @Patch(':id')
  // TODO: Check if user has CASL update permission (owner should be able)
  async updateChannel(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
    @Body() channelData: UpdateChannelDto,
  ) {
    const channel = await this.channelsService.getChannelById(
      Number(channelId),
    );
    const abilities = this.abilityFactory.createForUser(req.user);

    if (abilities.can(ChannelAction.Update, channel))
      return this.channelsService.updateChannel(Number(channelId), channelData);
    throw new HttpException('TODO: Unauthorized patch', 400);
  }

  @Delete(':id')
  // TODO: Check if user has CASL delete permission
  async deleteChannel(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
  ) {
    const channel = await this.channelsService.getChannelById(
      Number(channelId),
    );
    const abilities = this.abilityFactory.createForUser(req.user);

    if (abilities.can(ChannelAction.Update, channel))
      return this.channelsService.deleteChannel(Number(channelId));
    throw new HttpException('TODO: Unauthorized delete', 400);
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
    @Body() joinChannelData: JoinChannelDto,
  ) {

    const relationship = await this.channelsService.getChannelRelationship(
      Number(channelId),
      req.user.id,
    );

    if (relationship) {
      // If we already have a relationship,
      // we have already joined or are banned from the channel

      // TODO: Improve exception
      throw new HttpException('TODO: Relationship already exists!', 400);
    }

    // TODO: Add check if password
    const channel = await this.channelsService.getChannelById(Number(channelId))
    if (channel.mode === ChannelModeTypes.protected) {
      await this.channelsService.verifyPassword(joinChannelData.password, channel.password);
    }

    await this.channelsService.createChannelRelationship(
      Number(channelId),
      req.user.id,
      // joinChannelData.type,
      ChannelRelationshipType.member
    );

  }

  @Delete(':id/leave')
  async leaveChannel(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
  ) {
    const relationship = await this.channelsService.getChannelRelationship(
      Number(channelId),
      req.user.id,
    );
    const sanction = relationship.type & ChannelRelationshipType.sanctioned;

    if (sanction) {
      // A sanctioned user is not deleted from relationships
      return this.channelsService.updateChannelRelationship(
        Number(channelId),
        req.user.id,
        sanction,
      );
    }

    return this.channelsService.deleteChannelRelationship(
      Number(channelId),
      req.user.id,
    );
  }

  // @Post(':id/invite')

  // Otherwise we need to specify it as a parameter



}