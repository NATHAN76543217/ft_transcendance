import { Body, Controller, Delete, Get, Param, Post, Put, Patch, SerializeOptions } from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/CreateUser.dto';
import UpdateUserDto from './dto/UpdateUser.dto';
import { FindOneParam } from './utils/findOneParams';

@Controller('users')
@SerializeOptions({
	strategy: 'exposeAll'
  })
export default class UsersController {
	constructor(
		private readonly usersService : UsersService )
	{}

	@Get()
	getAllUsers() {
		return this.usersService.getAllUsers();
	}

	@Get(':id')
	getUserById(@Param('id') id: FindOneParam){
		return this.usersService.getUserById(Number(id));
	}

	@Post()
	async createUser(@Body() User: CreateUserDto) {
	  return this.usersService.createUser(User);
	}
   
	@Patch(':id')
	async updateUser(@Param('id') id: FindOneParam, @Body() User: UpdateUserDto) {
	  return this.usersService.updateUser(Number(id), User);
	}
   
	@Delete(':id')
	async deleteUser(@Param('id') id: FindOneParam) {
	  return this.usersService.deleteUser(Number(id));
	}

}
