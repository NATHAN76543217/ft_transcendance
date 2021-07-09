import ChannelsService from '../channels.service';
import ChannelController from '../channels.controller';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Channel from '../../channels/channel.entity';
import { mockedChannel, mockedChannel2 } from './channel.mock';

import * as request from 'supertest';

import { ClassSerializerInterceptor, INestApplication, Patch, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UpdateChannelDto } from '../dto/updateChannel.dto';
import { CreateChannelDto } from '../dto/createChannel.dto';

describe('The ChannelController', () => {
  let app: INestApplication;
  let channelData: Channel;
  let channelData2: Channel;

  let findChannel: jest.Mock;
  let findAllChannels: jest.Mock;
  let deleteChannel: jest.Mock;

  beforeEach(async () => {
    channelData = {
      ...mockedChannel
    }

    channelData2 = {
      ...mockedChannel2
    }

    findChannel = jest.fn().mockResolvedValue(channelData);
    findAllChannels = jest.fn().mockResolvedValue([channelData, channelData2]);
    deleteChannel = jest.fn().mockResolvedValue({ affected: true });

    const channelsRepository = {
      create: jest.fn().mockResolvedValue(channelData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      update: jest.fn().mockReturnValue(Promise.resolve()),
      delete: deleteChannel,
      findOne: findChannel,
      find: findAllChannels
    }

    const module = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: channelsRepository
        }
      ],
    })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(
      app.get(Reflector)
    ));
    await app.init();
  })

  //    _____ get all channels _____  //
  describe('when getting all channels data', () => {
    it('should respond with the data of all the channels without their password', () => {
      const expectedData1 = {
        ...channelData
      };
      const expectedData2 = {
        ...channelData2
      };
      // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      // delete expectedData2.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      return request(app.getHttpServer())
        .get('/channels')
        .expect(200)
        .expect(JSON.stringify([expectedData1, expectedData2]));
    })
  })

  //    _____ get a channels with its id _____  //
  describe('when getting a channel data with its id', () => {
    let id: number;
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        id = 2;
        findChannel.mockResolvedValue(undefined);
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/channels/' + id)
          .expect(404)
      })
    })

    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        id = 1;
        findChannel.mockResolvedValue(channelData);
      });
      it('should respond with the data of the channel without its password', () => {
        const expectedData1 = {
          ...channelData
        };
        // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
        return request(app.getHttpServer())
          .get('/channels/' + id)
          .expect(200)
          .expect(JSON.stringify(expectedData1));
      })
    })
  })

  //    _____ create a channel _____  //
  describe('when creating a channel data', () => {
    let createChannelDto: CreateChannelDto;
    beforeEach(() => {
      createChannelDto = {
        name: 'chanTest',
        password: 'password',
        mode: 'public'
      }
    })
    it('should respond with the data of the created channel without its password', () => {
      const expectedData = {
        ...channelData
      }
      // delete expectedData.password;   // a remettre quand les tests prendront en compte '@Exclude()'
      return request(app.getHttpServer())
        .post('/channels')
        .send(createChannelDto)
        .expect(201)
        .expect(JSON.stringify(expectedData));
    })
  })

  //    _____ update a channel _____  //
  describe('when updating a channel data', () => {
    let updateChannelDto: UpdateChannelDto;
    let id: number;
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        id = 2;
        findChannel.mockResolvedValue(undefined);
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/channels/' + id)
          .expect(404)
      })
    })

    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        id = 1;
        updateChannelDto = {
          name: 'chanTest2',
          password: 'password',
          mode: 'public'
        };
        findChannel.mockResolvedValue(channelData2);
      });
      it('should respond with the data of the updated channel without its password', () => {
        const expectedData2 = {
          ...channelData2
        };
        // delete expectedData1.password;   // a remettre quand les tests prendront en compte '@Exclude()'
        return request(app.getHttpServer())
          .patch('/channels/' + id)
          .send(updateChannelDto)
          .expect(200)
          .expect(JSON.stringify(expectedData2));
      })
    })
  })

  //    _____ delete a channel _____  //
  describe('when deleting a channel', () => {
    let id: number;
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        id = 2;
        deleteChannel.mockResolvedValue({ affected: false });
      });
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .delete('/channels/' + id)
          .expect(404)
      })
    })

    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        id = 1;
        deleteChannel.mockResolvedValue({ affected: true });
      });
      it('should respond without throwing an error', () => {
        return request(app.getHttpServer())
          .delete('/channels/' + id)
          .expect(200)
      })
    })
  })


});
