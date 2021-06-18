import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import Message from '../messages/message.entity';
import User from '../user/user.entity';

@Entity()
class Channel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true})
    public name: string;

    @Column()
    @Exclude()
    public password: string; // public ?

    @Column()
    public mode: string;

    @OneToMany(() => Message, (message: Message) => message.id_chan)
    public messages: Message[];

    @ManyToMany(() => User, (user: User) => user.channels)
    @JoinTable()
    public users: User[];
}

export default Channel;