import { Body, Controller, Delete, Get, Param, Post, Put, Patch } from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/CreateUser.dto';
import UpdateUserDto from './dto/UpdateUser.dto';

@Controller('users')
export default class UsersController {
	constructor(
		private readonly usersService : UsersService )
	{}

	@Get()
	getAllUsers() {
		return this.usersService.getAllUsers();
	}

	@Get(':id')
	getUserById(@Param('id') id: string){
		return this.usersService.getUserById(Number(id));
	}

	@Post()
	async createUser(@Body() User: CreateUserDto) {
	  return this.usersService.createUser(User);
	}
   
	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() User: UpdateUserDto) {
	  return this.usersService.updateUser(Number(id), User);
	}
   
	@Delete(':id')
	async deleteUser(@Param('id') id: string) {
	  this.usersService.deleteUser(Number(id));
	}
	
}
