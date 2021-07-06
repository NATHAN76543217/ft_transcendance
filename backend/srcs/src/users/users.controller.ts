import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  SerializeOptions,
  Query,
  UseGuards,
} from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/CreateUser.dto';
import UpdateUserDto from './dto/UpdateUser.dto';
import { FindOneParam } from './utils/findOneParams';
import UserRelationshipsService from './relationships/user-relationships.service';
import CreateUserRelationshipDto from './dto/CreateUserRelationship.dto';
import UpdateUserRelationshipDto from './dto/UpdateUserRelationship.dto';

@Controller('users')
@SerializeOptions({
  strategy: 'exposeAll',
})
export default class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRelationshipsService: UserRelationshipsService,
  ) {}

  @Get()
  getUsers(@Query('name') name: string) {
    return this.usersService.getAllUsers(name);
  }

  @Get(':id')
  // TODO see if bellow comment is needed
  // @UseGuards(JwtAuthenticationGuard)
  getUserById(@Param('id') id: FindOneParam) {
    return this.usersService.getUserById(Number(id));
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
    @Param('id') id: FindOneParam,
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
