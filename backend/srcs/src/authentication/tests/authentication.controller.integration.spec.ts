import { AuthenticationService } from '../authentication.service';
import { AuthenticationController } from '../authentication.controller';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import UsersService from '../../users/users.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { mockedUser } from './user.mock';

import * as request from 'supertest';

import { plainToClass } from 'class-transformer';

import { INestApplication, Patch, ValidationPipe } from '@nestjs/common';

describe('The AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    userData = {
      ...mockedUser
    }
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      // create: jest.fn().mockResolvedValue(plainToClass(User, userData)),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    }

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository
        }
      ],
    })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  })

  //    _____ registration flow _____  //
  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of a user without a password', () => {
        const expectedData = {
          ...userData
        }
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/authentication/registerWithPassword')
          .send({
            name: "name",
            password: "password",
            imgPath: "path"
          })
          .expect(201)
          .expect(expectedData);
      })
    })
    describe('and using invalid data', () => {
      it ('should throw an error', () => {
        return request(app.getHttpServer())
        .post('/authentication/registerWithPassword')
        .send({
          name: mockedUser.name
        })
        .expect(400);
      })
    })
  })

});
