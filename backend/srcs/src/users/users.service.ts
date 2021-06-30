import { Injectable } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import User from './user.entity';
import UpdateUserDto from './dto/UpdateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import UserNotFound from './exception/UserNotFound.exception';
import UserOauthIdNotFound from './exception/UserOauthIdNotFound.exception';
import axios from 'axios';
import UserRelationshipsService from './relationships/user-relationships.service';
import { FindOneParam } from './utils/findOneParams';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  async getAllUsers(name: string) {
    if (name === undefined) {
      return await this.usersRepository.find({ relations: ['channels'] });
    }
    return this.usersRepository.find({
      where: { 'name': Like('%' + name + '%') }});
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne(id, { relations: ['channels'] });
    if (user) {
      return user;
    }
    throw new UserNotFound(id);
  }

  async getUserByName(name: string) {
    if (name !== undefined)
    // const user = await this.usersRepository.findOne(name, { relations: ['channels'] });
    return this.usersRepository.findOne(name, { relations: ['channels']});
  }


  async getUsersFiltertByName(name: string) {
    let results = this.usersRepository.find({
      where: { 'name': Like('%' + name + '%') }});
      return results;
  }

  async getUserBy42Id(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { 
        school42id: id
      }, 
    });
    if (user)
      return user;
    else
      throw new UserOauthIdNotFound(id);
  }

  async getUserByGoogleId(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { 
        googleid: id
      }, 
    });
    if (user)
      return user;
    else
      throw new UserOauthIdNotFound(id);
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

  async deleteUser(id: string, userRelationshipsService: UserRelationshipsService) {

    try {
      const dataRel = await userRelationshipsService.getAllUserRelationshipsFromOneUser(id);
      if (dataRel) {
        dataRel.map((relation) => {
          userRelationshipsService.deleteUserRelationship(Number(relation.id))
        })
      }
    } catch (error) {}

    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFound(Number(id));
    }
  }

}