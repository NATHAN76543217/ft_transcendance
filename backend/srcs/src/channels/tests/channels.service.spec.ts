import ChannelsService from '../channels.service';
import UsersService from '../../users/users.service';
import { Repository } from 'typeorm';
import Channel from '../channel.entity';
import { Test } from '@nestjs/testing';
import User from '../../users/user.entity';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { mockedJwtService } from '../../utils/mocks/jwt.service';
// import { mockedConfigService } from '../../utils/mocks/config.service';
 
describe('The ChannelsService', () => {
    let channelService: ChannelsService;
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
                ChannelsService,
                // UsersService,
                // {
                //     provide: getRepositoryToken(User),
                //     useValue: {},
                // },
                {
                    provide: getRepositoryToken(Channel),
                    useValue: {
                        findOne,
                        find,
                        create,
                        save
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
        channelService = await module.get<ChannelsService>(ChannelsService);
    })
    describe('when getting all channels', () => {
        let channel1: Channel;
        let channel2: Channel;
            beforeEach(() => {
                channel1 = new Channel();
                channel2 = new Channel();
                find.mockReturnValue(Promise.resolve({channel1, channel2}));
            })
            it('should return a channels list', async() => {
                const fetchedChannelList = await channelService.getAllChannels("");
                expect(fetchedChannelList).toEqual({channel1, channel2});
            })
    })
    describe('when getting a channel by id', () => {
        describe('and the channel is matched', () => {
            let channel: Channel;
            beforeEach(() => {
                channel = new Channel();
                findOne.mockReturnValue(Promise.resolve(channel));
            })
            it('should return the channel', async () => {
                const fetchedChannel = await channelService.getChannelById(1);  // 1 or other value ?
                expect(fetchedChannel).toEqual(channel);
            })
        })
        describe('and the channel is not matched', () => {
            beforeEach(() => {
                findOne.mockReturnValue(undefined);
            })
            it('should throw an error', async () => {
                await expect(channelService.getChannelById(1)).rejects.toThrow();
            })
        })
    })
    // describe('when creating a channel', () => {
    //     let channel: Channel;
    //     beforeEach(() => {
    //         channel = new Channel();
    //         create.mockReturnValue(channel);
    //         save.mockReturnValue(Promise.resolve(channel));
    //     })
    //     it('should return a channel', async () => {
    //         const fetchedChannel = await channelService.createChannel();
    //         expect(fetchedChannel).toEqual(channel);
    //     })
    // })
});