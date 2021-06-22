import { NotFoundException } from "@nestjs/common/exceptions"

export default class MatchNotFoundByPlayerId extends NotFoundException
{
    constructor(id: string)
    { super(`Match containing player ${id} not found.`); }
}