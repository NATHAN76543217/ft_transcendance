import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import Channel from '../channels/channel.entity';
import { Transform } from 'stream';
import UsersController from './users.controller';
import User from './user.entity';
import { UserRelationshipTypes } from './utils/userRelationshipTypes'

@Entity()
class UserRelationship {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true, default: null })
    public type: UserRelationshipTypes;

    @ManyToOne(() => User, user => user.userRelationship1)
    public user1_id: string;                        // id ou User ?

    @ManyToOne(() => User, user => user.userRelationship2)
    public user2_id: string;
}
export default UserRelationship;