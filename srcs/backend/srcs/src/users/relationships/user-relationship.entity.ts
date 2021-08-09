import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRelationshipTypes } from './userRelationshipTypes';

@Entity()
@Unique(['user1_id', 'user2_id'])
class UserRelationship {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: UserRelationshipTypes.null })
  public type: UserRelationshipTypes;

  @Column({ nullable: true })
  // @ManyToOne(() => User, user => user.userRelationship1)
  public user1_id: string;

  @Column({ nullable: true })
  // @ManyToOne(() => User, user => user.userRelationship2)
  public user2_id: string;
}
export default UserRelationship;
