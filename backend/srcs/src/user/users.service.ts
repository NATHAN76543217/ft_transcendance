import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import User from './user.interface';
import UpdateUserDto from './dto/updateUser.dto';
 
@Injectable()
export default class UsersService {
  private lastUserId = 0;
  private users: User[] = [];
 
  getAllUsers() {
    return this.users;
  }
 
  getUserById(id: number) {
    const user = this.users.find(user => user.id === id);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
 
  replaceUser(id: number, user: UpdateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = user;
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
 
  createUser(user: CreateUserDto) {
    const newUser = {
      id: ++this.lastUserId,
      ...user
    }
    this.users.push(newUser);
    return newUser;
  }
 
  deleteUser(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      this.users.splice(userIndex, 1);
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}