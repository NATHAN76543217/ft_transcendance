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

export enum MessageType {
  // TODO
}

export type Message = {
  id: number;
  type: MessageType;
  data: string;
  author_id: number; //
}

export type Channel = {
  id: number;

  name: string;

  mode: ChannelMode;

  messages: Message[];

  myRole: ChannelRelationshipType;

  users: ChannelUserRelationship[];
};
// This should be in the Channel relationship itself (backend)
//export type ChannelMetadata = Channel | { id: number } & { lastReadMessageId: number, lastReceivedMessageId: number };
