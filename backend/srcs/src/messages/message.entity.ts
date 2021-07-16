import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Channel from '../channels/channel.entity';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public sender_id: number;

  @Column()
  public channel_id: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @Column()
  public text: string;

  @ManyToOne(() => Channel, (channel: Channel) => channel.messages)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  public channel: Channel;
}
