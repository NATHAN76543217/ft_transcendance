import { IUser } from "../user/IUser";
import {
  ChannelRelationship,
  ChannelRelationshipType,
} from "./ChannelRelationship";

export enum ChannelMode {
  public = 1,
  protected = 2,
  private = 4,
}

export type ChannelUser =
  | IUser
  | {
      id: number;
      name: string;
      imgPath: string;
    };

export type ChannelUserRelationship =
  | ChannelRelationship
  | {
      type: ChannelRelationshipType;
      user: ChannelUser;
    };

export type Channel = {
  id: number;

  name: string;

  mode: ChannelMode;

  // messages: Message[];

  myRole: ChannelRelationshipType;

  users: ChannelUserRelationship[];
};
