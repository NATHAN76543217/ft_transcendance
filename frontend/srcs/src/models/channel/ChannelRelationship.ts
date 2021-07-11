import { Channel } from "./Channel";

export enum ChannelRelationshipType {
  null = 0,

  standard = 1,
  admin = 2,
  owner = 4,

  ban = 8,
  mute = 16,
}

export type ChannelRelationship = {
  id: number;
  type: ChannelRelationshipType;
  channel_id: string;
  user_id: string;
  user_name: string;
  channel: Channel;
};
