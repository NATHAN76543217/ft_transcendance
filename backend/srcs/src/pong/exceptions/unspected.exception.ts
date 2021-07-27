import {
    HttpException,
    HttpStatus
} from "@nestjs/common"

export default class Unspected extends HttpException
{
    constructor(msg : string)
    { super(`Forbidden: Uspected error: ${msg}.`, HttpStatus.FORBIDDEN); }
}
