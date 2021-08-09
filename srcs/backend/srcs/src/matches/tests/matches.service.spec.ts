import MatchesService from '../matches.service';
import Match from '../matches.entity';
import CreateMatchesDto from '../dto/createMatch.dto';
import UpdateMatchDto from '../dto/updateMatch.dto';

import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { matches } from 'class-validator';

describe('MatchesService : GET', () => {
  let matchesService: MatchesService;
  let findOne: jest.Mock;
  let find: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    find = jest.fn();
    create = jest.fn();
    save = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        MatchesService,
        // UsersService,
        // {
        //     provide: getRepositoryToken(User),
        //     useValue: {},
        // },
        {
          provide: getRepositoryToken(Match),
          useValue: {
            findOne,
            find,
            create,
            save,
          },
        },
        // {
        //     provide: JwtService,
        //     useValue: mockedJwtService
        // },
        // {
        //     provide: ConfigService,
        //     useValue: mockedConfigService
        // }
      ],
    }).compile();
    matchesService = await module.get<MatchesService>(MatchesService);
  });
  describe('when getting all matches', () => {
    let match1: Match;
    let match2: Match;
    beforeEach(() => {
      match1 = new Match();
      match2 = new Match();
      find.mockReturnValue(Promise.resolve({ match1, match2 }));
    });
    it('should return a matches list', async () => {
      const fetchedMatchesList = await matchesService.getAllMatches();
      expect(fetchedMatchesList).toEqual({ match1, match2 });
    });
  });
  describe('when getting a match by id', () => {
    describe('and the match is matched', () => {
      let match: Match;
      beforeEach(() => {
        match = new Match();
        findOne.mockReturnValue(Promise.resolve(match));
      });
      it('should return the channel', async () => {
        const fetchedChannel = await matchesService.getMatchById('1');
        expect(fetchedChannel).toEqual(match);
      });
    });
    describe('and the match is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(matchesService.getMatchById('1')).rejects.toThrow();
      });
    });
  });

  // describe("Post a match", () => {

  //     it("Should be getable by all the ways", () => {
  //         const idOfMatch : number = 1;
  //         const idOfPlayerOne : string = "user1";
  //         const idOfPlayerTwo : string = "user2"
  //         const match : CreateMatchesDto = {
  //             idMatch: idOfMatch,
  //             idPlayerOne: idOfPlayerOne,
  //             idPlayerTwo: idOfPlayerTwo,
  //             startTime: new Date(),
  //         };
  //         matchesService.createMatch(match);

  //         expect(
  //             matchesService.getMatchById(idOfMatch)
  //         ).toReturn()

  //         expect(
  //             matchesService.getAllMatchesByPlayerId(idOfPlayerOne)
  //         ).toReturn()

  //         expect(
  //             matchesService.getCurrentMatchesById(idOfMatch)
  //         ).toReturn()

  //         expect(
  //             matchesService.getCurrentMatchesByPlayerId(idOfPlayerTwo)
  //         ).toReturn()
  //     })

  //     it("Should be patchable", () => {

  //         const idOfMatch : number = 42;
  //         const idOfPlayerTwo : string = "UUSSEERR2"

  //         let match : UpdateMatchesDto = {
  //             idMatch: idOfMatch,
  //             idPlayerOne: "UUSSEERR1",
  //             idPlayerTwo: idOfPlayerTwo,
  //             scorePlayerOne: 0,
  //             scorePlayerTwo: 0,
  //             startTime: new Date(),
  //             endTime: undefined
  //         };

  //         matchesService.createMatch(match);

  //         match.endTime = new Date();

  //         matchesService.updateMatch(idOfMatch, match);

  //         expect(
  //             matchesService.getMatchById(idOfMatch)
  //         ).toReturn()

  //         expect(
  //             matchesService.getAllMatchesByPlayerId(idOfPlayerTwo)
  //         ).toReturn()

  //         expect(
  //             matchesService.getCurrentMatchesById(idOfMatch)
  //         ).toThrow()

  //         expect(
  //             matchesService.getCurrentMatchesByPlayerId(idOfPlayerTwo)
  //         ).toThrow()

  //     })

  //     it("Sould be removable", () => {

  //         const idOfMatch : number = 21;

  //         const match : CreateMatchesDto = {
  //             idMatch: idOfMatch,
  //             idPlayerOne: "SOMEID",
  //             idPlayerTwo: "SOMEOTHERID",
  //             startTime: new Date(),
  //         };

  //         matchesService.createMatch(match);

  //         expect(
  //             matchesService.getMatchById(idOfMatch)
  //         ).toReturn()

  //         matchesService.deleteMatch(idOfMatch);

  //         expect(
  //             matchesService.getMatchById(idOfMatch)
  //         ).toThrow()
  //     })
  //})
});
