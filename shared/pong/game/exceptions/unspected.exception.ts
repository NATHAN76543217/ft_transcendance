import {
    BaseError,
    EXCEPTION
} from "./base.exception"

export default class Unspected extends BaseError
{
    public readonly what : string = Unspected.name
        + EXCEPTION + "Uspected Errror.";

    constructor(msg : string)
    { super(); }
}