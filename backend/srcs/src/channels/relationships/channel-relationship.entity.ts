import User from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Channel from '../channel.entity';
import { ChannelRelationshipType } from './channel-relationship.type';

@Entity()
// This should be infered by primary keys @Unique(['channel_id', 'user_id'])
class ChannelRelationship {
  // This primary key shall be replaced by a combination of the foreign keys
  //@PrimaryGeneratedColumn()
  //public id: number;
  @PrimaryColumn()
  channel_id: number;

  @PrimaryColumn()
  user_id: number;

  // These references are provided through JoinTable functionality
  //    @Column({ nullable: true })
  //    public channel_id: number;

  //    @Column({ nullable: true })
  //    public user_id: number;

  //    @Column({ nullable: true })
  //    public user_name: string;

  // TODO: Maybe use cascades on creation and update too
  // Provides channel id
  // The onDelete: 'CASCADE' attribute ensures deletion in foreign entities
  @ManyToOne(() => Channel, (channel) => channel.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  public channel: Channel;

  // Provides user name and id
  @ManyToOne(() => User, (user) => user.channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({ default: ChannelRelationshipType.null })
  public type: ChannelRelationshipType;

  // Maybe useful later
  //@CreateDateColumn()
  //created_at: Date;
}
export default ChannelRelationship;
