export class BaseError
{
    constructor()
    { Error.apply(arguments, /*this*/ ); }
}

BaseError.prototype = new Error(); // Have to make sure this line is executed

export const EXCEPTION : string = "exception: ";
