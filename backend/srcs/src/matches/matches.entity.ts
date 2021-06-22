import {
    Entity,
    PrimaryGeneratorColumn,
    Column
} from "typeorm"

@Entity
export default class Match
{
    @PrimaryGeneratorColumn
    public id : number;

    @Column({unique: true})
    public readonly idPlayerOne : string;

    @Column({unique: true})
    public readonly idPlayerTwo : string;

    @Column({nullable: true, default: 0})
    public scorePlayerOne : string;

    @Column({nullable: true, default: 0})
    public scorePlayerTwo : string;

    // Should be nullable or not ?
    @Column({nullable: true, default: new Date()})
    public readonly startTime : Date;

    @Column({nullable: true, default: undefined})
    public endTime : Date;
}