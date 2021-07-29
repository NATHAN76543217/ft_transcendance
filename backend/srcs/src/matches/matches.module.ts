import { Module } from "@nestjs/common"
import MatchesControler from "./matches.controller"
import MatchesService from "./matches.service"
import Match from "./matches.entity"
import {
    PongGateway
} from "../pong/server/socketserver"

import { TypeOrmModule } from "@nestjs/typeorm"

/* Global TODOs:
	- Better (js) syntax in MatchesService's functions.
	- Test the functionality of the module
*/

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
    controllers: [MatchesControler],
    providers: [
        MatchesService,
        PongGateway
    ],
    exports: [MatchesService]
})
export default class MatchesModule { }