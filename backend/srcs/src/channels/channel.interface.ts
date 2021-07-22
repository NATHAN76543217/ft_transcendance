import { ChannelMode } from './utils/channelModeTypes';

export default interface Channel {
  id: number;

  name: string;

  password: string;

  mode: ChannelMode;

  // messages: Message[];

  // users: User[];
}
