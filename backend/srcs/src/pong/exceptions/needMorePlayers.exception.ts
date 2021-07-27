import {
    HttpException,
    HttpStatus
} from "@nestjs/common"

export default class NeedMorePlayers extends HttpException
{
    constructor()
    { super("Forbidden: Need more players.", HttpStatus.FORBIDDEN); }
}
