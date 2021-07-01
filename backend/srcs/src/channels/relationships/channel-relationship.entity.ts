import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { ChannelRelationshipTypes } from './channelRelationshipTypes'

@Entity()
class ChannelRelationship {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({default: ChannelRelationshipTypes.null })
    public type: ChannelRelationshipTypes;

    @Column({nullable: true})
    public channel_id: string;
    
    @Column({nullable: true})
    public user_id: string;

    @Column({nullable: true})
    public user_name: string;
}
export default ChannelRelationship;