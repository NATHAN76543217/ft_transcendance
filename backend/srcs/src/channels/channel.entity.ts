import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import Message from '../messages/message.entity';
import User from '../users/user.entity';
import { IsNumber } from 'class-validator';
import { ChannelModeTypes } from './utils/channelModeTypes';

@Entity()
class Channel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true})
    public name: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    public password: string; // public ?

    @Column({default: ChannelModeTypes.public})
    public mode: ChannelModeTypes;

    @OneToMany(() => Message, (message: Message) => message.id_chan)
    public messages: Message[];

    @ManyToMany(() => User, (user: User) => user.channels)
    @JoinTable()
    public users: User[];
}

export default Channel;