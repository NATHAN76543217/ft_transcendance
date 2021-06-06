
class BaseError
{
    constructor()
    { Error.apply(arguments, this); }
}

BaseError.prototype = new Error(); // Have to make sure this line is executed

const EXCEPTION : string = "exception: ";

export class GameObjIsOutOfRange extends BaseError
{
    public readonly what : string = GameObjIsOutOfRange.name
        + EXCEPTION + "Game obj is out of canvas range." 

    constructor()
    { super(); }
}

