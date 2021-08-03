export namespace Events {
  /** These events are received by the client */
  export enum Client {
    Authenticated = 'authenticated',
    UpdateUserRelation = 'updateRelationship-back',
    UpdateUserInfo = 'updateUserInfo-back',
    UpdateUserRole = 'updateRole-back',
    UpdateUserStatus = 'statusChanged',
    UpdateChannelRelation = 'updateChannelRelationship-back',
    UserMessage = 'message-user',
    JoinChannel = 'joinChannel-back',
    LeaveChannel = 'leaveChannel-back',
    ChannelMessage = 'message-channel',
  }

  /** These events are sent to the server */
  export enum Server {
    StartGame = 'startGame-front',
    EndGame = 'endGame-front',
    UpdateUserRelation = 'updateRelationship-front',
    UpdateUserInfo = 'updateUserInfo-front',
    UpdateUserRole = 'updateRole-front',
    UpdateChannelRelation = 'updateChannelRelationship-front',
    UserMessage = 'message-user',
    JoinChannel = 'joinChannel-front',
    LeaveChannel = 'leaveChannel-front',
    DestroyChannel = 'destroyChannel-front',
    ChannelMessage = 'message-channel',
  }
}
