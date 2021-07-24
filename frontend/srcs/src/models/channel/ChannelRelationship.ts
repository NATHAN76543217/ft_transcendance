import { IUser, UserRole } from "../user/IUser";
import { Channel } from "./Channel";

export enum ChannelRelationshipType {
  Null = 0,

  Member = UserRole.User,

  /** Channel owner */
  Owner = UserRole.Owner,
  /** Channel administrator */
  Admin = UserRole.Admin,

  /** Banned user */
  Banned = UserRole.Banned,
  /** Muted user */
  Muted = ChannelRelationshipType.Banned << 1,

  /** Invited member */
  Invited = ChannelRelationshipType.Muted << 1,

  /** Sanction mask */
  Sanctioned = ChannelRelationshipType.Banned | ChannelRelationshipType.Muted,
}

export type ChannelRelationship = {
  channel_id: number;
  user_id: number;
  type: ChannelRelationshipType;
  user_name: string;
  channel: Channel;
  user: IUser;
};
