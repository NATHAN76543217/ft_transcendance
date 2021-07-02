import {
    NotFoundException
} from '@nestjs/common'

export default class RoomNotFound extends NotFoundException
{
    constructor(
        roomId : string
    )
    { super(`Room id: ${roomId}: no such room.`); }
}