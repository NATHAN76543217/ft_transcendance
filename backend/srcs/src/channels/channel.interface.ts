import { ChannelModeTypes } from './utils/channelModeTypes';

export default interface Channel {
  id: number;

  name: string;

  password: string;

  mode: ChannelModeTypes;

  // messages: Message[];

  // users: User[];
}
