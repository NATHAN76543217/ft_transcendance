export interface IRange
{
    min : number;
    max : number;
}


export class Range implements IRange
{
    constructor(
        public readonly min : number,
        public readonly max : number
    )
    { }
}