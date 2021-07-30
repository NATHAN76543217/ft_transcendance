import MatchesService from '../matches.service';
import MatchesController from '../matches.controller';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Match from '../matches.entity';
import { mockedMatch1, mockedMatch2, mockedMatch3 } from './matches.mock';
import * as request from 'supertest';
import { plainToClass } from 'class-transformer';
import {
  ClassSerializerInterceptor,
  INestApplication,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { number } from '@hapi/joi';
import UpdateMatchDto from '../dto/updateMatch.dto';
import CreateMatchesDto from '../dto/createMatch.dto';

describe('The MatchesController', () => {
  let app: INestApplication;
  let matchData: Match;
  let matchData2: Match;
  let matchData3: Match;

  let findMatch: jest.Mock;
  let findAllMatches: jest.Mock;
  let deleteMatch: jest.Mock;

  beforeEach(async () => {
    matchData = {
      ...mockedMatch1,
    };

    matchData2 = {
      ...mockedMatch2,
    };

    matchData3 = {
      ...mockedMatch3,
    };

    findMatch = jest.fn().mockResolvedValue(matchData);
    findAllMatches = jest.fn().mockResolvedValue([matchData, matchData2]);
    deleteMatch = jest.fn().mockResolvedValue({ affected: true });

    const matchesRepository = {
      create: jest.fn().mockResolvedValue(matchData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      update: jest.fn().mockReturnValue(Promise.resolve()),
      delete: deleteMatch,
      findOne: findMatch,
      find: findAllMatches,
    };

    const module = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: matchesRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();
  });

  // Get all Matches
  describe('when getting all matches data', () => {
    it('should respond with the data of all the matches', () => {
      const expectedData1 = {
        ...matchData,
      };
      const expectedData2 = {
        ...matchData2,
      };
      // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      // delete expectedData2.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      return request(app.getHttpServer())
        .get('/matches')
        .expect(200)
        .expect(JSON.stringify([expectedData1, expectedData2]));
    });
  });

  // Get a match using it id
  describe('when getting a match data with its id', () => {
    let id: string;
    describe('and the match is not found in the database', () => {
      beforeEach(() => {
        id = '2';
        findMatch.mockResolvedValue(undefined);
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/matches/' + id)
          .expect(404);
      });
    });
    describe('and the match is found in the database', () => {
      beforeEach(() => {
        id = '1';
        findMatch.mockResolvedValue(matchData);
      });
      it('should respond with the data of the match without its password', () => {
        const expectedData1 = {
          ...matchData,
        };
        // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
        return request(app.getHttpServer())
          .get('/matches/' + id)
          .expect(200)
          .expect(JSON.stringify(expectedData1));
      });
    });
  });

  // Create a match
  describe('when creating a match data', () => {
    let createMatchesDto: CreateMatchesDto;
    beforeEach(() => {
      createMatchesDto = {
        idMatch: '1',
        idPlayerOne: '1',
        idPlayerTwo: '2',
        startTime: new Date(),
      };
    });
    it('should respond with the data of the created matches', () => {
      const expectedData = {
        ...matchData,
      };
      // delete expectedData.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      return request(app.getHttpServer())
        .post('/matches')
        .send(createMatchesDto)
        .expect(201)
        .expect(JSON.stringify(expectedData));
    });
  });

  // Update Matches
  describe('when updating a matches data', () => {
    let updateMatchesDto: UpdateMatchDto;
    let id: string;
    describe('and the matches is not found in the database', () => {
      beforeEach(() => {
        id = '2';
        findMatch.mockResolvedValue(undefined);
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/matches/' + id)
          .expect(404);
      });
    });
    describe('and the match is found in the database', () => {
      beforeEach(() => {
        id = '1';
        updateMatchesDto = {
          idMatch: '1',
          idPlayerOne: '1',
          idPlayerTwo: '2',
          scorePlayerOne: 9,
          scorePlayerTwo: 4,
          startTime: new Date(),
          endTime: undefined,
        };
        findMatch.mockResolvedValue(matchData2);
      });
      it('should respond with the data of the updated match', () => {
        const expectedData2 = {
          ...matchData2,
        };
        // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
        return request(app.getHttpServer())
          .patch('/match/' + id)
          .send(updateMatchesDto)
          .expect(200)
          .expect(JSON.stringify(expectedData2));
      });
    });
  });

  // Delete a Match
  describe('when deleting a match', () => {
    let id: string;
    describe('and the match is not found in the database', () => {
      beforeEach(() => {
        id = '2';
        deleteMatch.mockResolvedValue({ affected: false });
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .delete('/matches/' + id)
          .expect(404);
      });
    });

    describe('and the match is found in the database', () => {
      beforeEach(() => {
        id = '1';
        deleteMatch.mockResolvedValue({ affected: true });
      });
      it('should respond without throwing an error', () => {
        return request(app.getHttpServer())
          .delete('/matches/' + id)
          .expect(200);
      });
    });
  });
});
