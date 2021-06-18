import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}

export default Channel;