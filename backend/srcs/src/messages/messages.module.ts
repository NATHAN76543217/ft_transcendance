import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import Message from "./message.entity";
import MessagesController from "./messages.controller";
import MessageService from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    controllers: [MessagesController],
    providers: [MessageService],
})
export class MessagesModule {}