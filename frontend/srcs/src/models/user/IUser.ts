import { Channel } from "../channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../channel/ChannelRelationship";

export enum  UserRole {
  User = 0,

  Owner = 1 << 0,
  Admin = 1 << 1,

  Banned = 1 << 2,
  //Muted = 1 << 3,
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
  twoFactorAuth: boolean;
  status: UserStatus;
  role: UserRole;
  channels: ChannelRelationship[];
};
