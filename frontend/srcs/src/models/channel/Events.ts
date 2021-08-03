export namespace Events {
  /** These events are received by the client */
  export enum Client {
    UpdateUserRelation = "updateRelationship-back",
    UpdateUserInfo = "updateUserInfo-back",
    UpdateUserRole = "updateRole-back",
    UpdateUserStatus = "statusChanged",
    UpdateChannelRelation = "updateChannelRelationship-back",
    UserMessage = "message-user",
    JoinChannel = "joinChannel-back",
    LeaveChannel = "leaveChannel-back",
  }

  /** These events are sent to the server */
  export enum Server {}
}
