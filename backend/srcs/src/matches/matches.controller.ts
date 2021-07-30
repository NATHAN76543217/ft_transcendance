import MatchesService from "./matches.service"
import { FindOneParam } from "src/users/utils/findOneParams";
import UpdateMatchesDto from "./dto/updateMatches.dto";
import CreateMatchesDto from "./dto/createMatches.dto"

import {
    Controller,
    Param,
    Get,
    Post,
	Patch,
	Body,
	Delete,
	SerializeOptions
} from "@nestjs/common"

// TO DO: Should exclude "matches/user/" route

@Controller("matches")
@SerializeOptions({
	strategy: 'excludeAll',
  })
export default class MatchesControler
{
    constructor(
        private readonly matchesServices : MatchesService
	)
	{ }

    @Get()
    public async getAllMatches()
    { return this.matchesServices.getAllMatches(); }

    @Get(':id')
    public async getMatchById(@Param('id') id : string )
	{ return this.matchesServices.getMatchById(id); }

	@Get("current")
	public async getCurrentMatches()
	{ return this.matchesServices.getCurrentMaches(); }

	@Get("current/:id")
	public async getCurrentMatchesById(@Param('id') id : string)
	{ return this.matchesServices.getCurrentMatchesById(id); }

	@Get("current/user/:id")
	public async getCurrentMatchesByPlayerId(@Param('id') id : string)
	{ return this.matchesServices.getCurrentMatchesByPlayerId(id); }

	@Get("user/:id")
	public async getMatchesByPlayerId(@Param('id') id : string)
	{ return this.matchesServices.getFiveLastMatchesByPlayerId(id); }

	@Post()
	public async createMatch(@Body() match : CreateMatchesDto)
	{ return this.matchesServices.createMatch(match); }

	// @Patch(':id')
	// public async updateMatchElement(@Param('id') id : FindOneParam, key : string, value : unknown)
	// { return this.matchesServices.updateMatchElement(Number(id), key, value); }

	@Patch(':id')
	public async updateMatch(id : string, match : UpdateMatchesDto)
	{ return this.matchesServices.updateMatch(id, match); }

	@Delete(':id')
	async deleteMatch(@Param('id') id : string)
	{ return this.matchesServices.deleteMatch(id); }
}