import ChannelsService from '../channels.service';
import UsersService from '../../user/users.service';
import { Repository } from 'typeorm';
import Channel from '../channel.entity';
import { Test } from '@nestjs/testing';
import User from '../../user/user.entity';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { mockedJwtService } from '../../utils/mocks/jwt.service';
// import { mockedConfigService } from '../../utils/mocks/config.service';
 
describe('The ChannelsService', () => {
    let channelService: ChannelsService;
    let findOne: jest.Mock;
    beforeEach(async () => {
        findOne = jest.fn();
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
                        findOne
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
});