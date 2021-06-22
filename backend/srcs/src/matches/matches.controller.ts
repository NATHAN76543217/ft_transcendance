import MatchesService from "./matches.service"
import { FindOneParam } from "src/users/utils/findOneParams";
import MatchesDto from "./dto/matches.dto";

import {
    Controller,
    Param,
    Get,
    Post,
	Patch,
	Body,
	Delete
} from "@nestjs/common"

@Controller("matches")
export default class MatchesControler
{
    constructor(
        private readonly matchesServices : MatchesService
    ) { }

    @Get()
    public async getAllMatches()
    { return this.matchesServices.getAllMatches(); }

    @Get(':id')
    public async getMatchById(@Param('id') id : FindOneParam )
	{ return this.matchesServices.getMatchById(Number(id)); }

	@Get("current")
	public async getCurrentMatches()
	{ return this.matchesServices.getCurrentMaches(); }

	// TO DO: Find how and which route use for player id finders

	@Post()
	public async createMatch(@Body() match : MatchesDto)
	{ return this.matchesServices.createMatch(match); }

	@Patch(':id')
	public async updateMatch(@Param('id') id : FindOneParam, key : string, value : unknown)
	{ return this.matchesServices.updateMatchElement(Number(id), key, value); }

	@Delete(':id')
	async deleteMatch(@Param(':id') id : FindOneParam)
	{ return this.matchesServices.deleteMatch(Number(id)); }
}