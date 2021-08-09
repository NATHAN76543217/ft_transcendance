import ChannelService from '../channels.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import Channel from '../../channels/channel.entity';
import ChannelsService from '../../channels/channels.service';
import { mockedChannel, mockedChannel2 } from './channel.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateChannelDto } from '../dto/createChannel.dto';
import { UpdateChannelDto } from '../dto/updateChannel.dto';
import ChannelNotFound from '../exception/ChannelNotFound.exception';

describe('The ChannelService', () => {
  let channelService: ChannelService;

  // let userData: User;
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
    deleteChannel = jest.fn().mockResolvedValue({affected: true});

    const channelsRepository = {
      create: jest.fn().mockResolvedValue(channelData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
      update: jest.fn().mockReturnValue(Promise.resolve()),
      delete: deleteChannel,
      findOne: findChannel,
      find: findAllChannels
    }

    const module = await Test.createTestingModule({
      providers: [
        // UsersService,
        ChannelService,
        {
          provide: getRepositoryToken(Channel),
          useValue: channelsRepository
        }
      ],
    })
      .compile();

    // --------------- use this
    // let channelsService: ChannelService;
    // channelsService = await module.get(ChannelService);
    // channelService = new ChannelService(channelsService);
    // -------------------------------

    // --------------- instead of this
    channelService = await module.get(ChannelService);
    // -------------------------------
  })

  //    _____ getChannelById _____  //
  describe('when accessing the data of a channel with its id', () => {
    let id: number;
    beforeEach(() => {
      id = 1;
    });
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        findChannel.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          channelService.getChannelById(id)
        ).rejects.toThrowError(new ChannelNotFound(id));
      })
    })
    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        findChannel.mockResolvedValue(channelData);
      });
      it('should return the channel data', async () => {
        const channel = await channelService.getChannelById(id)
        expect(channel).toBe(channelData);
      })
    })
  })

  //    _____ getAllChannels _____  //
  describe('when accessing the data of all channels', () => {
    describe('and there is no channel in the database', () => {
      beforeEach(() => {
        findAllChannels.mockResolvedValue([]);
      });
      it('should return an empty response', async () => {
        const channels = await channelService.getAllChannels()
        expect(channels).toStrictEqual([]);
      })
    })
    describe('and there is at least one channel in the database', () => {
      beforeEach(() => {
        findAllChannels.mockResolvedValue([channelData, channelData2]);
      });
      it('should return the channels data', async () => {
        const channels = await channelService.getAllChannels()
        expect(channels).toStrictEqual([channelData, channelData2]);
      })
    })
  })

  //    _____ createChannel _____  //
  describe('when creating a channel', () => {
    let createChannelDto: CreateChannelDto;
    beforeEach(() => {
      createChannelDto = {
        name: 'chanTest',
        password: 'password',
        mode: 'public',
      }
    });
    it('should return the channel data', async () => {
      const expectedData = {
        ...channelData
      }
      // delete expectedData.password;
      const channel = await channelService.createChannel(createChannelDto)
      expect(channel).toStrictEqual(expectedData);
    })
  })

  //    _____ updateChannel _____  //
  describe('when updating a channel', () => {
    let updateChannelDto: UpdateChannelDto;
    let id: number;
    beforeEach(() => {
      updateChannelDto = {
        name: 'chanTest2',
        password: 'password',
        mode: 'public',
      };
      id = 1;
    });
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        findChannel.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          channelService.updateChannel(id, updateChannelDto)
          ).rejects.toThrowError(new ChannelNotFound(id));
      })
    })
    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        findChannel.mockResolvedValue(channelData2);
      });
      it('should return the channel data', async () => {
        const expectedData = {
          ...channelData2
        }
        // delete expectedData.password;
        const channel = await channelService.updateChannel(id, updateChannelDto)
        expect(channel).toStrictEqual(expectedData);
      })
    })
  })

  //    _____ deleteChannel _____  //
  describe('when deleting a channel', () => {
    let id: number;
    beforeEach(() => {
      id = 1;
    });
    describe('and the channel is not found in the database', () => {
      beforeEach(() => {
        deleteChannel.mockResolvedValue({affected: false});
      });
      it('should throw an error', async () => {
        await expect(
          channelService.deleteChannel(id)
          ).rejects.toThrowError(new ChannelNotFound(id));
      })
    })
    describe('and the channel is found in the database', () => {
      beforeEach(() => {
        deleteChannel.mockResolvedValue({affected: true});
      });
      it('should return', async () => {
        await expect(
          channelService.deleteChannel(id)
        ).resolves.not.toThrow();
      })
    })
  })

});