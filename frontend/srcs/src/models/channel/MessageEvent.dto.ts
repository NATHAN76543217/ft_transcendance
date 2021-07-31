export enum MessageType {
  Text,
  GameInvite,
  GameCancel,
  GameSpectate,
  FriendInvite,
  RoleUpdate,
  PrivateMessage,
}

export type MessageEventDto = {
  channel_id?: number;
  receiver_id?: number;
  //sender_id: number;
  type: MessageType;
  data: string;
};

export type UserMessageEventDto = MessageEventDto & {
  receiver_id: number;
  type: MessageType;
  data: string;
};
