import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelCaslAbilityFactory } from "src/channels/channel-casl-ability.factory";

import Message from "./message.entity";
import MessagesController from "./messages.controller";
import MessageService from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    controllers: [MessagesController],
    providers: [MessageService, ChannelCaslAbilityFactory],
})
export class MessagesModule {}