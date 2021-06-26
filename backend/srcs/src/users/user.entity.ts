import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import Channel from '../channels/channel.entity';
import { Transform } from 'stream';

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true})
    public name: string;

    @Column({ nullable: true, default: "" })
    // @Exclude()
    public password: string;

    @Column({ nullable: true, default: 0 })
    public nbWin: number;

    @Column({ nullable: true, default: 0 })
    public nbLoss: number;

    @Column({ nullable: true })
    public stats: number;

    @Column({ nullable: true })
    public imgPath: string;

    @Column({ unique: true, nullable: true })
    public school42id: number;

    @Column({ unique: true, nullable: true })
    public googleid: string;

    @Column({ nullable: true, default: false})
    public twoFactorAuth: boolean;

    @Column({ nullable: true })
    public status: string;

    @ManyToMany(() => Channel, (channel: Channel) => channel.users)
    public channels: Channel[];

    public jwt: string;
}
export default User;