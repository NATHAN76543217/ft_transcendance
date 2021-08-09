import MatchesService from '../matches.service';
import Match from '../matches.entity';
import CreateMatchesDto from '../dto/createMatch.dto';
import UpdateMatchDto from '../dto/updateMatch.dto';
import { Test } from '@nestjs/testing';
import { mockedMatch1, mockedMatch2, mockedMatch3 } from './matches.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import MatchNotFound from '../exceptions/MatchNotFound.exception';
// TO DO: TEST all expections
// TO DO: TEST MORE
// TO DO: Match controler tests too !

describe('The MatchService', () => {
  let matchService: MatchesService;

  // let userData: User;
  let matchesData: Match;
  let matchesData2: Match;
  let matcheslData3: Match;
  let findMatch: jest.Mock;
  let findAllMatches: jest.Mock;
  let deleteMatch: jest.Mock;

  beforeEach(async () => {
    matchesData = {
      ...mockedMatch1,
    };
    matchesData2 = {
      ...mockedMatch2,
    };
    matchesData2 = {
      ...mockedMatch3,
    };

    findMatch = jest.fn().mockResolvedValue(matchesData);
    findAllMatches = jest.fn().mockResolvedValue([matchesData, matchesData2]);
    deleteMatch = jest.fn().mockResolvedValue({ affected: true });

    const matchesRepository = {
      create: jest.fn().mockResolvedValue(matchesData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      update: jest.fn().mockReturnValue(Promise.resolve()),
      delete: deleteMatch,
      findOne: findMatch,
      find: findAllMatches,
    };

    const module = await Test.createTestingModule({
      providers: [
        // UsersService,
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: matchesRepository,
        },
      ],
    }).compile();

    matchService = await module.get(MatchesService);
  });
  describe('when accessing the data of a match with its id', () => {
    let id: string;
    beforeEach(() => {
      id = '1';
    });
    describe('and the match is not found in the database', () => {
      beforeEach(() => {
        findMatch.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(matchService.getMatchById(id)).rejects.toThrowError(
          new MatchNotFound(id),
        );
      });
    });
    describe('and the match is found in the database', () => {
      beforeEach(() => {
        findMatch.mockResolvedValue(matchesData);
      });
      it('should return the match data', async () => {
        const matches = await matchService.getMatchById(id);
        expect(matches).toBe(matchesData);
      });
    });
  });
  /// getAllMatches
  describe('when accessing the data of all matches', () => {
    describe('and there is no match in the database', () => {
      beforeEach(() => {
        findAllMatches.mockResolvedValue([]);
      });
      it('should return an empty response', async () => {
        const matches = await matchService.getAllMatches();
        expect(matches).toStrictEqual([]);
      });
    });
    describe('and there is at least one matches in the database', () => {
      beforeEach(() => {
        findAllMatches.mockResolvedValue([matchesData, matchesData2]);
      });
      it('should return the matches data', async () => {
        const matches = await matchService.getAllMatches();
        expect(matches).toStrictEqual([matchesData, matchesData2]);
      });
    });
  });

  // CreateMatch
  describe('when creating a match', () => {
    let createMatchesDto: CreateMatchesDto;
    beforeEach(() => {
      createMatchesDto = {
        idMatch: '1',
        idPlayerOne: '1',
        idPlayerTwo: '2',
        startTime: new Date(),
      };
    });
    it('should return the matches data', async () => {
      const expectedData = {
        ...matchesData,
      };
      // delete expectedData.password;
      const matches = await matchService.createMatch(createMatchesDto);
      expect(matches).toStrictEqual(expectedData);
    });
  });

  // UpdateMatch
  describe('when updating a match', () => {
    let updateMatchesDto: UpdateMatchDto;
    let id: string;
    beforeEach(() => {
      updateMatchesDto = {
        idMatch: '1',
        idPlayerOne: '1',
        idPlayerTwo: '2',
        scorePlayerOne: 9,
        scorePlayerTwo: 4,
        startTime: new Date(),
        endTime: undefined,
      };
      id = '1';
    });
    describe('and the match is not found in the database', () => {
      beforeEach(() => {
        findMatch.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          matchService.updateMatch(id, updateMatchesDto),
        ).rejects.toThrowError(new MatchNotFound(id));
      });
    });
    describe('and the match is found in the database', () => {
      beforeEach(() => {
        findMatch.mockResolvedValue(matchesData2);
      });
      it('should return the match data', async () => {
        const expectedData = {
          ...matchesData2,
        };
        // delete expectedData.password;
        const match = await matchService.updateMatch(id, updateMatchesDto);
        expect(match).toStrictEqual(expectedData);
      });
    });
  });

  describe('when deleting a match', () => {
    let id: string;
    beforeEach(() => {
      id = '1';
    });
    describe('and the match is not found in the database', () => {
      beforeEach(() => {
        deleteMatch.mockResolvedValue({ affected: false });
      });
      it('should throw an error', async () => {
        await expect(matchService.deleteMatch(id)).rejects.toThrowError(
          new MatchNotFound(id),
        );
      });
    });
    describe('and the match is found in the database', () => {
      beforeEach(() => {
        deleteMatch.mockResolvedValue({ affected: true });
      });
      it('should return', async () => {
        await expect(matchService.deleteMatch(id)).resolves.not.toThrow();
      });
    });
  });
});
