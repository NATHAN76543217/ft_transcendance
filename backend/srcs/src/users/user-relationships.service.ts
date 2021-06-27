import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import UserRelationshipNotFound from './exception/UserRelationshipNotFound.exception';
import UserRelationship from './user-relationship.entity';
import UpdateUserRelationshipDto from './dto/UpdateUserRelationship.dto';
import CreateUserRelationshipDto from './dto/CreateUserRelationship.dto';
import UserRelationshipByNameNotFoundException from './exception/UserRelationshipByNameNotFound.exception';

@Injectable()
export default class UserRelationshipsService {
  constructor(
    @InjectRepository(UserRelationship)
    private userRelationshipsRepository: Repository<UserRelationship>
  ) { }

  async getAllUserRelationships() {
    return await this.userRelationshipsRepository.find();
  }

  async getAllUserRelationshipsFromOneUser(id: string) {
    return await this.userRelationshipsRepository.find({
      where: [
        { 'user1_id': Like(id) },
        { 'user2_id': Like(id) }
      ]
    });
  }

  async getUserRelationshipByIds(id1: string, id2: string) {
    let userRelationship;
    if (Number(id1) < Number(id2)) {
      userRelationship = await this.userRelationshipsRepository.findOne({ user1_id: id1, user2_id: id2 });
    }
    else {
      userRelationship = await this.userRelationshipsRepository.findOne({ user1_id: id2, user2_id: id1 });
    }
    if (userRelationship) {
      return userRelationship;
    }
    throw new UserRelationshipByNameNotFoundException(id1, id2);
  }

  // async getUserRelationshipsFilteredByName(name: string) {
  //   let results = this.userRelationshipsRepository.find({
  //     where: { 'name': Like('%' + name + '%') }});
  //     return results;
  // }

  async updateUserRelationship(id: number, userRelationship: UpdateUserRelationshipDto) {
    await this.userRelationshipsRepository.update(id, userRelationship);
    const updatedUserRelationship = this.userRelationshipsRepository.findOne(id);
    if (updatedUserRelationship) {
      return updatedUserRelationship;
    }
    throw new UserRelationshipNotFound(id);
  }

  async createUserRelationship(userRelationship: CreateUserRelationshipDto) {
    let id_temp;
    if (Number(userRelationship.user1_id) > Number(userRelationship.user2_id)) {
      id_temp = userRelationship.user1_id;
      userRelationship.user1_id = userRelationship.user2_id;
      userRelationship.user2_id = id_temp;
    }
    const newUserRelationship = this.userRelationshipsRepository.create(userRelationship);
    await this.userRelationshipsRepository.save(newUserRelationship);
    return newUserRelationship;
  }

  async deleteUserRelationship(id: number) {
    const deleteResponse = await this.userRelationshipsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserRelationshipNotFound(id);
    }
  }

}