import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './utils/userRole';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import { UserStatus } from './utils/userStatus';
import { Exclude } from 'class-transformer';
// import { Message } from 'src/messages/message.entity';

@Entity()
//@Unique('name', ['name'])
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @Column({ nullable: true, default: '', select: false })
  // @Exclude()
  public password: string;

  @Column({ nullable: true, default: 0 })
  public nbWin: number;

  @Column({ nullable: true, default: 0 })
  public nbLoss: number;

  @Column({ nullable: true })
  public stats: number;

  @Column({ nullable: true, default: 'default-profile-picture.png' })
  public imgPath: string;

  @Column({ unique: true, nullable: true })
  public school42id: number;

  @Column({ unique: true, nullable: true })
  public googleid: string;

  @Column({ nullable: true, default: false })
  public twoFactorAuth: boolean;

  @Column({ default: UserRole.User })
  public role: UserRole;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(
    () => ChannelRelationship,
    (relationship: ChannelRelationship) => relationship.user,
  )
  public channels: ChannelRelationship[];

  // @OneToMany(() => Message, (message: Message) => message.channel)
  // public messages: Message[];

  // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user1_id)
  // public userRelationship1: UserRelationship[]

  // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user2_id)
  // public userRelationship2: UserRelationship[]

  //@Column({ nullable: true, default: UserStatus.offline })
  public status: UserStatus;

  public jwt: string;
}
export default User;
