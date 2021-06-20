import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import UsersService from '../../users/users.service';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { mockedConfigService } from '../../utils/mocks/config.service';

// import bcrypt from "bcrypt";
import * as bcrypt from 'bcrypt';  // for unit tests

jest.mock('bcrypt');
 
describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  let bcryptCompare: jest.Mock;
  let spyCompare: jest.SpyInstance;
  
  beforeEach(async () => {
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      spyCompare = jest.spyOn(bcrypt, 'compare');
    
    const module = await Test.createTestingModule({
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
          useValue: {}
        }
      ],
    })
      .compile();

    // --------------- use this
      let configService: ConfigService;
      configService = await module.get(ConfigService);
      let jwtService: JwtService;
      jwtService = await module.get(JwtService);
      let usersService: UsersService;
      usersService = await module.get(UsersService);
      authenticationService = new AuthenticationService(usersService, jwtService, configService);
    // -------------------------------

    // --------------- instead of this
      // authenticationService = await module.get(AuthenticationService);
    // -------------------------------
  })
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId)
      ).toEqual('string')
    })
  })
  describe('when verifying a password', () => {
    let plainTextPassword: string;
    let hashedPassword: string;
    plainTextPassword = "password";
    hashedPassword = "hashedPassword";
    
    describe ('and the password is incorrect', () => {
        beforeEach(() => {
            bcryptCompare.mockReturnValue(false);
        });
        it('should throw an error', async () => {
            await expect(
                  authenticationService.verifyPassword(plainTextPassword, hashedPassword)
            ).rejects.toThrow();
        })
     })

      describe ('and the password is correct', () => {
            beforeEach(async () => {
                bcryptCompare.mockReturnValue(true);
            });
            it('should return', async () => {
                await expect(
                      authenticationService.verifyPassword(plainTextPassword, hashedPassword)
                ).resolves.not.toThrow();
            })
      })
      
    it('should call compare', async () => {
        beforeEach(async () => {
            bcryptCompare.mockReturnValue(true);
        });
        await authenticationService.verifyPassword(plainTextPassword, hashedPassword)
        expect(spyCompare).toHaveBeenCalled();
        expect(spyCompare).toHaveBeenCalledTimes(1);
        expect(spyCompare).toHaveBeenCalledWith(plainTextPassword, hashedPassword);
    })

  })
});
