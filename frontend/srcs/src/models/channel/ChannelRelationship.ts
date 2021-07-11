import { IUser } from "../user/IUser";
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
  channel_id: number;
  user_id: number;
  type: ChannelRelationshipType;
  user_name: string;
  channel: Channel;
  user: IUser;
};
