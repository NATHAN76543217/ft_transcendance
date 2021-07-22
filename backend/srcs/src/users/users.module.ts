import { forwardRef, Global, Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import UserRelationship from './relationships/user-relationship.entity';
import UserRelationshipsService from './relationships/user-relationships.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRelationship]),
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRelationshipsService],
  exports: [UsersService, UserRelationshipsService],
})
export default class UsersModule {}
