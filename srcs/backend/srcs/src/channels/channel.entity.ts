import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
//import { Exclude } from 'class-transformer';
import { Message } from '../messages/message.entity';
import { ChannelMode } from './utils/channelModeTypes';
import ChannelRelationship from './relationships/channel-relationship.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @Column({ select: true })
  // TODO: Check if this is still needed
  //@Exclude({ toPlainOnly: true })
  public password: string; // public ?

  @Column({ default: ChannelMode.public })
  public mode: ChannelMode;

  @OneToMany(() => Message, (message: Message) => message.channel, {nullable: true})
  public messages: Message[];

  // TODO: (Insertion does not seem to be so useful after all)
  // Using cascades to insert into relationship table when inserting here
  // This seems to be the easiest way to handle channel CASL all-in-one
  @OneToMany(
    () => ChannelRelationship,
    (relationship: ChannelRelationship) => relationship.channel,
    { cascade: ['insert', 'update'] },
  )
  public users: ChannelRelationship[];
}

export default Channel;
