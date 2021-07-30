import Match from "./matches.entity"
import CreateMatchesDto from "./dto/createMatches.dto"
import UpdateMatchesDto from "./dto/updateMatches.dto"

import MatchNotFound from "./exceptions/MatchNotFound.exception"
import MatchNotFoundByPlayerId from "./exceptions/MatchNotFoundByPlayerId.exception"
import CurrMatchesNotFound from "./exceptions/CurrMatchesNotFound.exception"
import CurrMatchNotFoundByPlayerId from "./exceptions/CurrMatchNotFoundByPlayerId.exception"
import DevWrongKeyGiven from "./exceptions/DevWrongKeyGiven.exception"

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export default class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>
    ) { }

    public async getAllMatches(): Promise<Match[]> {
        const matches = await this.matchesRepository.find();
        return (matches);
    }

    public async getMatchById(id: string): Promise<Match> {
        const match = await this.matchesRepository.findOne(id);
        if (match)
            return (match);
        throw new MatchNotFound(id); // TODO
    }

    // TO DO: Weird code
    public async getAllMatchesByPlayerId(id: string): Promise<Match[]> {
        let match = await this.matchesRepository.find({
            where: {
                idPlayerOne: id
            }
        });
        if (match)
            return (match);
        match = await this.matchesRepository.find({
            where: {
                idPlayerTwo: id
            }
        });
        if (match)
            return (match);
        throw new MatchNotFoundByPlayerId(id);
    }

    public async getFiveLastMatchesByPlayerId(id: string): Promise<Match[]> {
        const maxCount = 5;

        const query = this.matchesRepository
            .createQueryBuilder('match')
            .where('match.idPlayerOne = :id', { id })
            .orWhere('match.idPlayerTwo = :id', { id })
            .orderBy('match.endTime', 'DESC')
            .take(maxCount)
            .orderBy('match.endTime', 'ASC')
        return query.getMany();
    }

    public async getCurrentMatchesByPlayerId(id: string): Promise<Match> {
        let match = await this.matchesRepository.findOne({
            where: {
                idPlayerOne: id,
                endTime: undefined
            }
        });
        if (match)
            return (match);
        match = await this.matchesRepository.findOne({
            where: {
                idPlayerTwo: id,
                endTime: undefined
            }
        });
        if (match)
            return (match);
        throw new CurrMatchNotFoundByPlayerId(id);
    }

    public async getCurrentMaches(): Promise<Match[]> {
        const currMatches = await this.matchesRepository.find({
            where: { endTime: undefined }
        });
        if (currMatches)
            return (currMatches);
        throw new CurrMatchesNotFound();
    }

    public async getCurrentMatchesById(id: string) {
        const currMatches = this.getCurrentMaches();
        const match = (await currMatches).find(currMatches => currMatches.id == id);
        if (match)
            return match;
        throw new MatchNotFound(id);
    }

    public async updateMatchElement(id: string, key: string, value: unknown) {
        // TO DO: This implementation seems nice but breaks constness
        //let match = this.getMatchById(id);
        //match[key as keyof Promise<Match>] = value;

        // This C style implementation does also the work: ...
        let match = this.getMatchById(id);
        switch (key) {
            case "scorePlayerOne": { (await match).scorePlayerOne = value as number; break; }
            case "scorePlayerTwo": { (await match).scorePlayerTwo = value as number; break; }
            case "endTime": { (await match).endTime = value as Date; break; }
            default: { throw new DevWrongKeyGiven(key); }
        }
    }

    public async updateMatch(id: string, match: UpdateMatchesDto) {
        await this.matchesRepository.update(id, match);
        const updatedMatch = this.getMatchById(id);
        if (updatedMatch)
            return updatedMatch;
        throw new MatchNotFound(id);
    }

    public async createMatch(match: CreateMatchesDto): Promise<Match> {
        const newMatch = this.matchesRepository.create(match);
        await this.matchesRepository.save(newMatch);
        return (newMatch);
    }

    public async deleteMatch(id: string) {
        const deleteResponse = await this.matchesRepository.delete(id);
        if (!deleteResponse.affected)
            throw new MatchNotFound(id);
    }
}
