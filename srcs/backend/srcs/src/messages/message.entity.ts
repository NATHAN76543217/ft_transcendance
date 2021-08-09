import User from 'src/users/user.entity';
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

export enum MessageType {
  Text,
  GameInvite,
  GameCancel,
  GameSpectate,
  FriendInvite,
  RoleUpdate,
  PrivateMessage,
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public sender_id: number;

  @Column()
  public channel_id: number;

  @Column()
  public receiver_id: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.Text })
  public type: MessageType;

  @Column()
  public data: string;

  @ManyToOne(() => Channel, (channel: Channel) => channel.messages, {
    nullable: true,
  })
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  public channel?: Channel;

  // @ManyToOne(type => Parent, parent => parent.children, { nullable: false })
  // parent!: Parent;
}
