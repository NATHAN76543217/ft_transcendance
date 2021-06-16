import { Test, TestingModule } from '@nestjs/testing';
import ChannelsController from './channels.controller';
import ChannelsService from './channels.service';

describe('ChannelsController', () => {
  let channelsController: ChannelsController;

  beforeEach(async () => {
    const channels: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [ChannelsService],
    }).compile();

    channelsController = channels.get<ChannelsController>(ChannelsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(channelsController.getAllChannels()).toBe('Hello World!');
    });
  });
});
