import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import Message from '../messages/message.entity';

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
}

export default Channel;