import User from '../../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Channel from '../channel.entity';
import { ChannelRelationshipTypes } from './channelRelationshipTypes';

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
  @ManyToOne(() => Channel, (channel) => channel.users)
  public channel: Channel;

  // Provides user name and id
  @ManyToOne(() => User, (user) => user.channels, { onDelete: 'CASCADE' })
  //@JoinColumn([{ referencedColumnName: 'id' }])
  public user: User;

  @Column({ default: ChannelRelationshipTypes.null })
  public type: ChannelRelationshipTypes;

  // Maybe useful later
  //@CreateDateColumn()
  //created_at: Date;
}
export default ChannelRelationship;
