import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  SerializeOptions,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/CreateUser.dto';
import UpdateUserDto from './dto/UpdateUser.dto';
import { FindOneParam } from './utils/findOneParams';
import UserRelationshipsService from './relationships/user-relationships.service';
import CreateUserRelationshipDto from './dto/CreateUserRelationship.dto';
import UpdateUserRelationshipDto from './dto/UpdateUserRelationship.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { UserRelationshipTypes } from './relationships/userRelationshipTypes';

@Controller('users')
@SerializeOptions({
  strategy: 'exposeAll',
})
@UseGuards(JwtAuthenticationGuard)
export default class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRelationshipsService: UserRelationshipsService,
  ) { }

  @Get()
  getUsers(@Query('name') name: string) {
    return this.usersService.getAllUsers(name);
  }

  @Get('me')
  getUserHimself(@Req() req: RequestWithUser) {
    return this.usersService.getUserById(req.user.id, true);
  }

  @Get(':id1/:id2/messages')
  async getMessagesById(
    @Req() req: RequestWithUser,
    @Param('id1') user1_id: string,
    @Param('id2') user2_id: string,
    @Query('beforeId') beforeId: string,
    @Query('afterId') afterId: string,
  ) {


    console.log('get :id1/:id2/messages - begin')
    // const channel = await this.channelsService.getChannelById(
    //   Number(channelId),
    // );
    // const abilities = this.abilityFactory.createForUser(req.user);

    //TODO use abilites
    // if (abilities.can(ChannelAction.Read, channel))
    try {
      const relation = await this.userRelationshipsService.getUserRelationshipByIds(user1_id, user2_id);
      if (relation.type !== UserRelationshipTypes.friends) {
        return [];
      }
    } catch (error) {
      return [];
    }

    const messages = await this.usersService.getMessagesById(
      Number(user1_id),
      Number(user2_id),
      beforeId ? Number(beforeId) : undefined,
      afterId ? Number(afterId) : undefined,
    );
    console.log('messages', messages)
    return messages;
    // throw new HttpException('TODO: Unauthorized read', 400);
  }

  @Get(':id')
  getUserById(@Req() req: RequestWithUser, @Param('id') id: FindOneParam) {
    const withChannels = req.user.id === Number(id);

    return this.usersService.getUserById(Number(id), withChannels);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    if (user.imgPath === '') {
      user.imgPath = 'default-profile-picture.png';
    }
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: FindOneParam, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: FindOneParam) {
    return this.usersService.deleteUser(id + '', this.userRelationshipsService);
  }

  // -----------------------------------
  // ---------- relationships ----------
  // -----------------------------------

  // FIXME: FindOneParam should be used with { id }

  @Get('relationships')
  getUserRelationships() {
    return this.userRelationshipsService.getAllUserRelationships();
  }

  @Get('relationships/:id')
  async getUserRelationshipsById(@Param('id') id: string) {
    return this.userRelationshipsService.getAllUserRelationshipsFromOneUser(id);
  }

  @Get('relationships/:id1/:id2')
  async getUserRelationshipsByIds(
    @Param('id1') id1: string,
    @Param('id2') id2: string,
  ) {
    return this.userRelationshipsService.getUserRelationshipByIds(id1, id2);
  }

  @Post('relationships')
  async createUserRelationship(
    @Body() userRelationship: CreateUserRelationshipDto,
  ) {
    return this.userRelationshipsService.createUserRelationship(
      userRelationship,
    );
  }

  @Patch('relationships/:id')
  async updateUserRelationship(
    @Param('id') id: string,
    @Body() userRelationship: UpdateUserRelationshipDto,
  ) {
    return this.userRelationshipsService.updateUserRelationship(
      Number(id),
      userRelationship,
    );
  }

  @Delete('relationships/:id')
  async deleteUserRelationship(@Param('id') id: FindOneParam) {
    return this.userRelationshipsService.deleteUserRelationship(Number(id));
  }
}
