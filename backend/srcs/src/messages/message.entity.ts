import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, ManyToOne } from "typeorm";
import Channel from '../channels/channel.entity';

@Entity()
export default class Message {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public id_sender: number;

    @Column({ nullable: true })
    public id_chan: number;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    // TODO: Check if this can be empty
    @Column()
    public text: string;

    @ManyToOne(() => Channel, (channel: Channel) => channel.messages)
    public channel: Channel;
    // should we keep the 'id_chan' above ? I don't think so
}