import { Module } from "@nestjs/common"
import MatchesControler from "./matches.controller"
import MatchesService from "./matches.service"
import Match from "./matches.entity"

import { TypeOrmModule } from "@nestjs/typeorm"

/* Global TODOs:
	- Better (js) syntax in MatchesService's functions.
	- Controler must handle player by id (all & currents).
	- Test the functionality of the module
*/

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
    controllers: [MatchesControler],
    providers: [MatchesService],
    exports: [MatchesService],
})
export default class MatchesModule { }




