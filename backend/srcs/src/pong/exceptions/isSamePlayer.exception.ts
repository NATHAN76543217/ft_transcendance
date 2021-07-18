import {
    HttpException,
    HttpStatus
} from '@nestjs/common'

export default class IsSamePlayer extends HttpException
{
    constructor(idPlayer : string)
    { super(`Forbidden: ${idPlayer} vs ${idPlayer}.`, HttpStatus.FORBIDDEN); }
}
