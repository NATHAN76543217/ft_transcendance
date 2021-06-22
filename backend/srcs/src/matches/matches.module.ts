import { Module } from "@nestjs/common"
import MatchesControler from "./matches.controller"
import MatchesService from "./matches.service"
import Match from "./matches.entity"

import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
    controllers: [MatchesControler],
    providers: [MatchesService],
    exports: [MatchesService]
})
export default class MatchesModule { }




