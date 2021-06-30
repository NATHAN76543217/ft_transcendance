import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import Channel from '../channels/channel.entity';
import { Transform } from 'stream';
import UsersController from './users.controller';
import UserRelationship from './relationships/user-relationship.entity'
import { UserRoleTypes } from './utils/userRoleTypes';

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true})
    public name: string;

    @Column({ nullable: true, default: "" })
    // @Exclude()
    public password: string;

    @Column({ nullable: true, default: 0 })
    public nbWin: number;

    @Column({ nullable: true, default: 0 })
    public nbLoss: number;

    @Column({ nullable: true })
    public stats: number;

    @Column({ nullable: true })
    public imgPath: string;

    @Column({ unique: true, nullable: true })
    public school42id: number;

    @Column({ unique: true, nullable: true })
    public googleid: string;

    @Column({ nullable: true, default: false})
    public twoFactorAuth: boolean;

    @Column({ nullable: true })
    public status: string;

    @Column({default: UserRoleTypes.null})
    public role: UserRoleTypes;

    @ManyToMany(() => Channel, (channel: Channel) => channel.users)
    public channels: Channel[];

    // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user1_id)
    // public userRelationship1: UserRelationship[]

    // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user2_id)
    // public userRelationship2: UserRelationship[]

    public jwt: string;
}
export default User;