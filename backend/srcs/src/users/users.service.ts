import { Injectable } from '@nestjs/common';
import CreateUserDto from './dto/CreateUser.dto';
import User from './user.entity';
import UpdateUserDto from './dto/UpdateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, SelectQueryBuilder } from 'typeorm';
import UserNotFound from './exception/UserNotFound.exception';
import UserOauthIdNotFound from './exception/UserOauthIdNotFound.exception';
import UserRelationshipsService from './relationships/user-relationships.service';
import UserNameNotFoundException from './exception/UserNameNotFound.exception';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(name: string) {
    if (name === undefined) {
      return await this.usersRepository.find({
        relations: ['channels', 'channels.channel'],
        order: { name: 'ASC' },
      });
    }
    return this.usersRepository.find({
      where: { name: Like('%' + name + '%') },
    });
  }

  async getUserById(id: number, withChannels = false) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id }); // Select user with id

    if (withChannels) this.joinChannels(query);
    const user = await query.getOne();

    if (user) return user;

    throw new UserNotFound(id);
  }

  private joinChannels(query: SelectQueryBuilder<User>): void {
    query
      .leftJoin('user.channels', 'channelRelation')
      .addSelect('channelRelation.type')
      .leftJoinAndSelect('channelRelation.channel', 'channel')
      .leftJoin('channel.users', 'channelUserRelation')
      .addSelect('channelUserRelation.type')
      .leftJoin('channelUserRelation.user', 'channelUser')
      .addSelect(['channelUser.id', 'channelUser.name', 'channelUser.imgPath']);
  }

  async getUserByName(
    name: string,
    withPassword = false,
    withChannels = false,
  ) {
    // This should never be false
    //if (name !== undefined)
    // const user = await this.usersRepository.findOne(name, { relations: ['channels'] });
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.name = :name', { name });

    if (withPassword) query.addSelect('user.password');
    if (withChannels) this.joinChannels(query);

    const user = await query.getOne();

    if (user) return user;

    throw new UserNameNotFoundException(name);
  }

  async getUsersFiltertByName(name: string) {
    const results = this.usersRepository.find({
      where: { name: Like('%' + name + '%') },
    });
    return results;
  }

  async getUserBy42Id(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        school42id: id,
      },
    });
    if (user) return user;
    else throw new UserOauthIdNotFound(id);
  }

  async getUserByGoogleId(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        googleid: id,
      },
    });
    if (user) return user;
    else throw new UserOauthIdNotFound(id);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = this.usersRepository.findOne(id, {
      relations: ['channels', 'channels.channel'],
    });
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

  async deleteUser(
    id: string,
    userRelationshipsService: UserRelationshipsService,
  ) {
    try {
      const dataRel =
        await userRelationshipsService.getAllUserRelationshipsFromOneUser(id);
      if (dataRel) {
        dataRel.map((relation) => {
          userRelationshipsService.deleteUserRelationship(Number(relation.id));
        });
      }
    } catch (error) {}

    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFound(Number(id));
    }
  }
}
