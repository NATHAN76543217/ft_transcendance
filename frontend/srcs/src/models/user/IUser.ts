import { Channel } from "../channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../channel/ChannelRelationship";
import { UserRelationshipType } from "./UserRelationship";

export enum UserRole {
  null = 0,

  owner = 1 << 1,
  admin = 1 << 2,

  ban = 1 << 4,

  // muted = 1 << 5
}

export enum UserStatus {
  null = 0,
  
  offline = 1 << 0,
  online = 1 << 1,
  inGame = 1 << 2,
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
  // TODO: We should use QueryBuilder to left join and map channel info into relationships
  // We should also map channel relationships to user information the other way around
  channels: ChannelRelationship[];

  // TODO: This should be in the parent UserRelation object
  // relationshipType: UserRelationshipType;
  idInf: boolean;
  //isBlock: boolean;
};
