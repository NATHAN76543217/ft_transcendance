import Channel from '../../channels/channel.entity';
import { ChannelModeTypes } from '../utils/channelModeTypes';


export const mockedChannel: Channel = {
  id: 1,
  name: 'chanTest',
  password: 'password',
  mode: ChannelModeTypes.public,
  messages: [],
  users: []
}

export const mockedChannel2: Channel = {
  id: 2,
  name: 'chanTest2',
  password: 'password',
  mode: ChannelModeTypes.public,
  messages: [],
  users: []
}
