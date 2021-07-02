import {
    HttpException
} from '@nestjs/common'

export default class RoomIsFull extends HttpException
{
    constructor()
    { super("Forbidden: Room is full.", HttpStatus.FORBIDDEN); }
}