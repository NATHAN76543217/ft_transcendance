import MatchesService from "../matches.service"
import Match from "../matches.entity"
import CreateMatchesDto from "../dto/createMatches.dto";
import UpdateMatchesDto from "../dto/updateMatches.dto";

import { Test } from "@nestjs/testing"
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';

describe("MatchesService : GET", () => {
    let matchesService : MatchesService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    validationSchema: Joi.object({
                    POSTGRES_HOST: Joi.string().required(),
                    POSTGRES_PORT: Joi.number().required(),
                    POSTGRES_USER: Joi.string().required(),
                    POSTGRES_PASSWORD: Joi.string().required(),
                    POSTGRES_DB: Joi.string().required(),
                    PORT: Joi.number(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_EXPIRATION_TIME: Joi.string().required(),
                    })
                }),
            ],
            providers: [
                MatchesService,
                {
                    provide: getRepositoryToken(Match),
                    useValue: {},
                }
            ],
        }).compile();
        matchesService = await module.get<MatchesService>(MatchesService);
    })
    describe("Post a match", () => {
        it("Should be getable by all the ways", () => {

            const idOfMatch : number = 1;
            const idOfPlayerOne : string = "user1";
            const idOfPlayerTwo : string = "user2"

            const match : CreateMatchesDto = {
                idMatch: idOfMatch,
                idPlayerOne: idOfPlayerOne,
                idPlayerTwo: idOfPlayerTwo,
                startTime: new Date(),
            };

            matchesService.createMatch(match);

            expect(
                matchesService.getMatchById(idOfMatch)
            ).toReturn()

            expect(
                matchesService.getAllMatchesByPlayerId(idOfPlayerOne)
            ).toReturn()

            expect(
                matchesService.getCurrentMatchesById(idOfMatch)
            ).toReturn()

            expect(
                matchesService.getCurrentMatchesByPlayerId(idOfPlayerTwo)
            ).toReturn()
        })

        it("Should be patchable", () => {

            const idOfMatch : number = 42;
            const idOfPlayerTwo : string = "UUSSEERR2"

            let match : UpdateMatchesDto = {
                idMatch: idOfMatch,
                idPlayerOne: "UUSSEERR1",
                idPlayerTwo: idOfPlayerTwo,
                scorePlayerOne: 0,
                scorePlayerTwo: 0,
                startTime: new Date(),
                endTime: undefined
            };

            matchesService.createMatch(match);

            match.endTime = new Date();

            matchesService.updateMatch(idOfMatch, match);

            expect(
                matchesService.getMatchById(idOfMatch)
            ).toReturn()

            expect(
                matchesService.getAllMatchesByPlayerId(idOfPlayerTwo)
            ).toReturn()

            expect(
                matchesService.getCurrentMatchesById(idOfMatch)
            ).toThrow()

            expect(
                matchesService.getCurrentMatchesByPlayerId(idOfPlayerTwo)
            ).toThrow()

        })

        it("Sould be removable", () => {

            const idOfMatch : number = 21;

            const match : CreateMatchesDto = {
                idMatch: idOfMatch,
                idPlayerOne: "SOMEID",
                idPlayerTwo: "SOMEOTHERID",
                startTime: new Date(),
            };

            matchesService.createMatch(match);

            expect(
                matchesService.getMatchById(idOfMatch)
            ).toReturn()

            matchesService.deleteMatch(idOfMatch);

            expect(
                matchesService.getMatchById(idOfMatch)
            ).toThrow()
        })
    })
});
