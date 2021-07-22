import Channel from '../../channels/channel.entity';
import { ChannelMode } from '../utils/channelModeTypes';


export const mockedChannel: Channel = {
  id: 1,
  name: 'chanTest',
  password: 'password',
  mode: ChannelMode.public,
  messages: [],
  users: []
}

export const mockedChannel2: Channel = {
  id: 2,
  name: 'chanTest2',
  password: 'password',
  mode: ChannelMode.public,
  messages: [],
  users: []
}
