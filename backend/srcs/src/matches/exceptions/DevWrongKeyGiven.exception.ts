import { NotFoundException } from "@nestjs/common/exceptions"

export default class DevWRongKeyGiven extends NotFoundException
{
    constructor(key: string)
    { super(`Invalid key argument ( \"${key}\" ) in \'MatchesService.updateMatchElement\'.`); }
}