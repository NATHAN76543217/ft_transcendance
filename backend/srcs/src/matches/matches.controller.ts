import MatchesService from './matches.service';
import { CreateMatchDto } from './dto/createMatch.dto';

import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { JwtTwoFactorGuard } from 'src/authentication/two-factor/jwt-two-factor.guard';
import UsersService from 'src/users/users.service';

// TO DO: Should exclude "matches/user/" route

@Controller('matches')
@UseGuards(JwtTwoFactorGuard)
export default class MatchesControler {
  constructor(
    private readonly matchesServices: MatchesService,
    private readonly usersServices: UsersService
  ) { }

  @Get()
  public async getAllMatches() {
    return this.matchesServices.getAllMatches();
  }

  @Get('current')
  public async getCurrentMatches() {
    return this.matchesServices.getCurrentMaches();
  }

  @Get('user/:id')
  public async getMatchesByPlayerId(@Param('id') id: string) {
    const matches = await this.matchesServices.getMatchesByPlayerId(Number(id));
    return matches;
  }

  @Get(':id')
  public async getMatchById(@Param('id') id: string) {
    return this.matchesServices.getMatchById(Number(id));
  }


  /*   @Get('current/:id')
  public async getCurrentMatchesById(@Param('id') id: string) {
    return this.matchesServices.getCurrentMatchById(id);
  } */

  /*   @Get('current/user/:id')
  public async getCurrentMatchesByPlayerId(@Param('id') id: string) {
    return this.matchesServices.getCurrentMatchesByPlayerId(id);
  } */


  @Post()
  public async createMatch(
    @Req() request: RequestWithUser,
    @Body() match: CreateMatchDto,
  ) {
    return this.matchesServices.createMatch(request.user.id, match);
  }

  // @Patch(':id')
  // public async updateMatchElement(@Param('id') id : FindOneParam, key : string, value : unknown)
  // { return this.matchesServices.updateMatchElement(Number(id), key, value); }
  /* 
  @Patch(':id')
  public async updateMatch(id: string, match: UpdateMatchesDto) {
    return this.matchesServices.updateMatch(id, match);
  } */

  @Delete(':id')
  async deleteMatch(@Param('id') id: string) {
    return this.matchesServices.deleteMatch(Number(id));
  }
}
