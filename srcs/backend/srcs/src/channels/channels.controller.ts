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
  Logger,
  BadRequestException,
} from '@nestjs/common';
import ChannelsService from './channels.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';

import UserNotFound from '../users/exception/UserNotFound.exception';
import UpdateChannelRelationshipDto from './dto/UpdateChannelRelationship.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import {
  ChannelAction,
  ChannelCaslAbilityFactory,
} from './channel-casl-ability.factory';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { ChannelMode } from './utils/channelModeTypes';
import {
  ChannelMessageAction,
  ChannelMessageCaslAbilityFactory,
} from './channel-message-casl-ability.factory';
import { JwtTwoFactorGuard } from 'src/authentication/two-factor/jwt-two-factor.guard';
import UsersService from 'src/users/users.service';
import { UserRole } from 'src/users/utils/userRole';

//REVIEW Remove dirty comments
@Controller('channels')
// @UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtTwoFactorGuard)
/* @SerializeOptions({
  strategy: 'exposeAll',
  // strategy: 'excludeAll'
}) */
export default class ChannelsController {
  private logger = new Logger('ChannelsController');

  constructor(
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    private readonly abilityFactory: ChannelCaslAbilityFactory,
    private readonly messageAbilityFactory: ChannelMessageCaslAbilityFactory,
  ) { }

  @Get(':id/messages')
  async getMessagesById(
    @Req() req: RequestWithUser,
    @Param('id') channelId: string,
    @Query('beforeId') beforeId: string,
    @Query('afterId') afterId: string,
  ) {
    try {
      const channel = await this.channelsService.getChannelById(
        Number(channelId),
      );
      const relation = channel.users.find((user) => {
        return user.user_id === req.user.id;
      });
      // const abilities = this.abilityFactory.createForUser(req.user);
      if (!relation) {
        return [];
      }
      const abilities =
        this.messageAbilityFactory.createForChannelRelationship(relation);

      if (abilities.can(ChannelMessageAction.Read, channel)) {
        return this.channelsService.getMessagesById(
          channel.id,
          beforeId ? Number(beforeId) : undefined,
          afterId ? Number(afterId) : undefined,
        );
      } else {
        return [];
      }
      throw new HttpException('TODO: Unauthorized read', 400);
    } catch (error) {
      return [];
    }
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

    if (abilities.can(ChannelAction.Read, channel)) {
      return channel;
    }
    throw new HttpException('TODO: Unauthorized read', 400);
  }

  // TODO: Nobody should be able to read all channels besides admin
  // Maybe this should only get channels with CASL read permissions
  @Get()
  //@UseGuards(PoliciesGuard)
  //@CheckPolicies(new ReadChannelPolicyHandler())
  async getChannels(@Req() req: RequestWithUser, @Query('name') name: string) {
    try {
      const user = await this.usersService.getUserById(req.user.id);


      const userRole = user ? user.role : UserRole.User;
      const isAdmin = (userRole === UserRole.Owner || userRole === UserRole.Admin)

      if (!name) {
        name = '';
      }
      let channels = this.channelsService.getAllChannels(name);
      channels.then((array) => {
        let len = array.length;
        while (--len >= 0) {
          let users = array[len].users;
          let relationType = ChannelRelationshipType.Null;
          users.map((elem) => {
            if (req.user.id === elem.user_id) {
              relationType = elem.type;
            }
          });
          if (!isAdmin &&
            (relationType === ChannelRelationshipType.Banned ||
              (array[len].mode === ChannelMode.private &&
                relationType === ChannelRelationshipType.Null))
          ) {
            array.splice(len, 1);
          }
        }
      });
      return channels;
    } catch (error) {
      throw new UserNotFound(req.user.id);
    }
  }

  // @Get()
  // async getChannelByName(@Query() name: string) {
  //   return this.channelsService.getChannelByName(name);
  // }

  @Post()
  async createChannel(@Body() channelData: CreateChannelDto) {
    const channel = await this.channelsService.createChannel(channelData);
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
    this.logger.debug(
      `Updating ${user_id}'s rel for ${channel_id}: ${JSON.stringify(
        channelRelationship,
      )}`,
    );

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
      // If we already have a relationship, we have already joined or are banned from the channel
      throw new BadRequestException('Relationship already exists');
    }

    const channel = await this.channelsService.getChannelById(
      Number(channelId),
    );
    if (channel.mode === ChannelMode.protected) {
      await this.channelsService.verifyPassword(
        joinChannelData.password,
        channel.password,
      );
    }

    await this.channelsService.createChannelRelationship(
      Number(channelId),
      req.user.id,
      ChannelRelationshipType.Member,
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
    const sanction = relationship.type & ChannelRelationshipType.Sanctioned;

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

  @Delete(':channel_id/kick/:user_id')
  async kickFromChannel(
    @Req() req: RequestWithUser,
    @Param('channel_id') channelId: string,
    @Param('user_id') userId: string,
  ) {
    const relationship = await this.channelsService.getChannelRelationship(
      Number(channelId),
      Number(userId),
    );
    const sanction = relationship.type & ChannelRelationshipType.Sanctioned;

    if (sanction) {
      // A sanctioned user is not deleted from relationships
      return this.channelsService.updateChannelRelationship(
        Number(channelId),
        Number(userId),
        sanction,
      );
    }

    return this.channelsService.deleteChannelRelationship(
      Number(channelId),
      Number(userId),
    );
  }
}
