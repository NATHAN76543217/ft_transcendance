import React from "react";

import { Socket } from "socket.io-client";
import { Action } from "./pages";

export type RuleSet = {
  duration?: number; // todo
  rounds?: number;
};

export interface IVector2D {
  x : number;
  y : number;
}

export class Vector2D implements IVector2D
{ 
  constructor(
    public x : number,
    public y : number,
  )
  { }

  // to do methods
}

export enum PlayerStatus {
  //INVITED,
  UNREADY,
  READY,
  CONNECTED,
  DISCONNECTED
}

export interface IPlayer {
  pos : Vector2D;
  width: number;
  height: number;
  status: PlayerStatus;
}

export interface IBallBase
{
  pos : Vector2D;
  dir : Vector2D;
  velocity : number;
}

export class Ball implements IBallBase {
  public defaultBall : IBallBase;

  constructor(
    public pos : Vector2D,
    public dir : Vector2D,
    public velocity : number,
    public rad : number
  )
  {
    this.defaultBall = this;
  }
}

const canvasDims : IVector2D = {
  x: 1600,
  y: 900
};

const defaultBall : Ball = new Ball(new Vector2D(canvasDims.x / 2, canvasDims.y / 2), new Vector2D(5, 5), 7, 10);

export type GameState = {
  players : Map<Number, IPlayer>;
  ball : Ball;
};

export interface IGameContext {
  socket?: Socket;
  ruleSet: RuleSet;
  rulesSetDispatch? : React.Dispatch<{ type: Action }>;
  state: GameState;
  stateDispatch? : React.Dispatch<{ type: Action }>;
  playerIds : number [];
  playerIdsDispatch? : React.Dispatch<{ type: Action }>;
}

export const defaultRuleSet: RuleSet = {
  duration: 3,
  rounds: 11,
};

export const defaultGameState: GameState = {
  players: new Map(),
  ball: defaultBall
};

export const GameContext = React.createContext<IGameContext>({
  ruleSet: defaultRuleSet,
  state: defaultGameState,
  playerIds: [],
});

