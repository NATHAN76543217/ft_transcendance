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
  Text,
  GameInvite,
  GameSpectate,
  FriendInvite,
  RoleUpdate,
  PrivateMessage,
}

export type Message = {
  id: number;
  type: MessageType;
  data: string;
  channel_id: number;
  receiver_id: number;
  sender_id: number;
  created_at: Date;
};

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
