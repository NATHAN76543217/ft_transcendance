import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, ManyToOne } from "typeorm";
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
    public channel: Channel;
}