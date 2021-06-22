import {
    BaseError,
    EXCEPTION
} from "./base"

export default class GameObjIsOutOfRange extends BaseError
{
    public readonly what : string = GameObjIsOutOfRange.name
        + EXCEPTION + "Game obj is out of canvas range.";

    constructor()
    { super(); }
}