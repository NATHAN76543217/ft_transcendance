import { Channel } from "../channel/Channel";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "../channel/ChannelRelationship";
import { UserRelationshipType } from "./UserRelationship";

export enum UserRole {
  null = 0,

  admin = 1,
  owner = 2,

  ban = 4,
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
  status: string;
  role: UserRole;
  // TODO: We should use QueryBuilder to left join and map channel info into relationships
  // We should also map channel relationships to user information the other way around
  channels: ChannelRelationship[];

  // TODO: This should be in the parent UserRelation object
  // relationshipType: UserRelationshipType;
  idInf: boolean;
  //isBlock: boolean;
};
