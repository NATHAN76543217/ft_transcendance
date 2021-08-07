export enum ServerMessages {
  CREATE_ROOM = "server:createRoom",
  JOIN_ROOM = "server:joinRoom",
  PUSH_GAME = "server:pushGame",
  UPDATE_GAME = "server:updateGame",
  FIND_GAME = "server:findGame",
  CANCEL_FIND = "server:cancelFind",
  UPDATE_MOUSE_POS = "server:updateMousePos",
  CALC_GAME_ST = "server:calcGameSt",
  LEAVE_ROOM = "server:leaveRoom",
  PLAYER_READY = "server:playerReady",
  PLAYER_GIVEUP = 'server:playerGiveUp',
  ACCEPT_INVITATION = 'server:acceptInvitation',
}

export enum ClientMessages {
  NOTIFY = "client:notify",
  MATCH_FOUND = "client:matchFound",
  RECEIVE_ST = "client:receiveSt",
  RECEIVE_STATUS = "client:receiveStatus",
  RECEIVE_PLAYERS = "client:receivePlayers",
  RECEIVE_SCORES = "client:receiveScores",
  RECEIVE_BALL = "client:receiveBall",
  JOINED = "client:joined",
  QUIT = 'client:quit',
  GUEST_REJECTION = "client:guestRejection",
  GAME_START = "client:gameStart",
  GAME_END = 'client:gameEnd',
  NO_GAME = 'client:noGame'
}

export interface IAcknowledgement {
  status: "ok" | "not ok";
}
