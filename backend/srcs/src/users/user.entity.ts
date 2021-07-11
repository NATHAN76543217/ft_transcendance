import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRoleTypes } from './utils/userRoleTypes';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';

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

  @Column({ nullable: true })
  public imgPath: string;

  @Column({ unique: true, nullable: true })
  public school42id: number;

  @Column({ unique: true, nullable: true })
  public googleid: string;

  @Column({ nullable: true, default: false })
  public twoFactorAuth: boolean;

  @Column({ nullable: true })
  public status: string;

  @Column({ default: UserRoleTypes.null })
  public role: UserRoleTypes;

  @OneToMany(
    () => ChannelRelationship,
    (relationship: ChannelRelationship) => relationship.user,
  )
  public channels: ChannelRelationship[];

  // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user1_id)
  // public userRelationship1: UserRelationship[]

  // @OneToMany(() => UserRelationship, userRelationship => userRelationship.user2_id)
  // public userRelationship2: UserRelationship[]

  public jwt: string;
}
export default User;
