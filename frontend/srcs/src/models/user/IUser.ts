import { Channel } from "../channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../channel/ChannelRelationship";

export enum UserRole {
  User = 1,

  Owner = User << 1,
  Admin = Owner << 1,

  Banned = Admin << 1,
}

export enum UserStatus {
  Null = 0,

  Offline = 1 << 0,
  Online = 1 << 1,
  InGame = 1 << 2,
}

export type UserChannelRelationship =
  | ChannelRelationship
  | {
      type: ChannelRelationshipType;
      channel: Channel;
    };

export type IUser = {
  id: number;
  name: string;
  password: string;
  nbWin: number;
  nbLoss: number;
  stats: number;
  imgPath: string;
  twoFactorAuthEnabled: boolean;
  firstConnection: boolean;
  status: UserStatus;
  role: UserRole;
  channels: UserChannelRelationship[];
};
