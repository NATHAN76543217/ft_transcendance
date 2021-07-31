import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './utils/userRole';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import { UserStatus } from './utils/userStatus';
import { Exclude } from 'class-transformer';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  // TODO: Should these fields be nullable?
  // TODO: Can we login if we use empty password on oauth accounts?
  @Column({ nullable: true, default: '', select: false })
  public password: string;

  @Column({ nullable: true, default: 0 })
  public nbWin: number;

  @Column({ nullable: true, default: 0 })
  public nbLoss: number;

  @Column({ nullable: true, default: 0 })
  public stats: number;

  @Column({ nullable: true, default: 'default-profile-picture.png' })
  public imgPath: string;

  @Column({ unique: true, nullable: true })
  public school42id: number;

  @Column({ unique: true, nullable: true })
  public googleid: string;

  @Column({ default: UserRole.User })
  public role: UserRole;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({
    default: false,
  })
  public twoFactorAuthEnabled: boolean;

  @Column({
    default: true,
  })
  public firstConnection: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  @Exclude()
  public twoFactorAuthSecret?: string;
  @OneToMany(
    () => ChannelRelationship,
    (relationship: ChannelRelationship) => relationship.user,
  )
  public channels: ChannelRelationship[];

  public status: UserStatus;

  public roomId: number;

  public jwt: string;
}
export default User;
