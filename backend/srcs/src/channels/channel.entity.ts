import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Channel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public password: string; // public ?

    @Column()
    public mode: string;
}

export default Channel;