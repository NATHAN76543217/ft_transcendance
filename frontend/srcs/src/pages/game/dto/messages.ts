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
}

export enum ClientMessages {
  NOTIFY = "client:notify",
  MATCH_FOUND = "client:matchFound",
  RECEIVE_ST = "client:receiveSt",
  JOINED = "client:joined",
}

export interface IAcknowledgement {
  status: "ok" | "not ok";
}
