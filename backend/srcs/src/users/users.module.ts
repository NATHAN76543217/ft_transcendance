import { forwardRef, Global, Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import UserRelationship from './relationships/user-relationship.entity';
import UserRelationshipsService from './relationships/user-relationships.service';
import { UsersGateway } from './users.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([UserRelationship]),
        // UsersSocketModule
        forwardRef(() => AuthenticationModule)
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        UserRelationshipsService,
        UsersGateway
    ],
    exports: [
        UsersService,
        UserRelationshipsService,
        UsersGateway
    ]
})
export default class UsersModule { }