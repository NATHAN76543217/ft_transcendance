import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Match {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int', { array: true, default: [0, 0] })
  public player_ids: number[];

  @Column('int', { array: true, default: [0, 0] })
  public scores: number[];
  
  // Should be nullable or not ?
  @Column({ nullable: true }) // TO DO: add timeout: @timestemp
  public readonly startedAt?: Date;

  @Column({ nullable: true, default: undefined })
  public endAt?: Date;
}
