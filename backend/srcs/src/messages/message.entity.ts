import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export default class Message {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public id_sender: number;

    @Column()
    public id_chat: number;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;

    // TODO: Check if this should be empty
    @Column()
    public text: string;
}