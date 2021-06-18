import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import User from './user.entity';
import UpdateUserDto from './dto/UpdateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserNotFound from './exception/userNotFound.exception';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  getAllUsers() {
    return this.usersRepository.find({ relations: ['channels'] });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['channels'] });
    if (user) {
      return user;
    }
    throw new UserNotFound(id);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = this.usersRepository.findOne(id, { relations: ['channels'] });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFound(id);
  }

  async createUser(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFound(id);
    }
  }
}