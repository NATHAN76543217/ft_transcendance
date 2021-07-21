import { IUser, UserRole } from "../user/IUser";
import { Channel } from "./Channel";

export enum ChannelRelationshipType {
  Member = UserRole.User,

  /** Channel owner */
  Owner = UserRole.Owner,
  /** Channel administrator */
  Admin = UserRole.Admin,

  /** Banned user */
  Banned = UserRole.Banned,
  /** Muted user */
  Muted = 1 << 3,

  /** Invited member */
  Invited = 1 << 4,

  /** Sanction mask */
  Sanctioned = Banned | Muted,
}

export type ChannelRelationship = {
  channel_id: number;
  user_id: number;
  type: ChannelRelationshipType;
  user_name: string;
  channel: Channel;
  user: IUser;
};
