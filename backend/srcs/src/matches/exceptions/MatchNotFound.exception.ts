import { NotFoundException } from "@nestjs/common/exceptions"

export default class MatchNotFound extends NotFoundException
{
    constructor(id: string)
    { super(`Match: ${id} not found.`); }
}