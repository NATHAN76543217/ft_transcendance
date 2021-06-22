import { NotFoundException } from "@nestjs/common/exceptions"

export default class CurrMatchesNotFound extends NotFoundException
{
    constructor()
    { super("There's not current matches avalaible."); }
}