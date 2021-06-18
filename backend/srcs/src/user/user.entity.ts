import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import Channel from '../channels/channel.entity';

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true})
    public name: string;

    @Column()
    public nbWin: number;

    @Column()
    public nbLoss: number;

    @Column()
    public stats: number;

    @Column()
    public imgPath: string;

    @Column()
    public twoFactorAuth: boolean;

    @Column()
    public status: string;

    @ManyToMany(() => Channel, (channel: Channel) => channel.users)
    public channels: Channel[];
}

export default User;