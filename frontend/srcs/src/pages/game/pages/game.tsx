import { useReducer } from "react";
import { Route, Switch } from "react-router";

import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";
import {
  defaultGameState,
  defaultRuleset,
  GameContext,
  GameState,
} from "../context";
import { Ruleset } from "../../../models/game/Ruleset.dto";

export enum Action {}

function stateReducer(state: GameState, action: { type: Action }) {
  switch (action.type) {
    default:
      return state;
  }
}

function rulesetReducer(state: Ruleset, action: { type: Action }) {
  switch (action.type) {
    default:
      return state;
  }
}

function playerIdsReducer(state: number[], action: { type: Action }) {
  switch (action.type) {
    default:
      return state;
  }
}

// Stuff TO DO:
// 1) Implement pages swiching
// 2) Implement create game
// 3) End Matchmaking
// 4) Build a pong engine & render

function Game() {
  const [state, stateDispatch] = useReducer(stateReducer, defaultGameState);
  const [ruleset, rulesSetDispatch] = useReducer(
    rulesetReducer,
    defaultRuleset
  );
  const [playerIds, playerIdsDispatch] = useReducer(playerIdsReducer, []);

  console.log("Game is present");

  return (
    <GameContext.Provider
      value={{
        state,
        stateDispatch,
        ruleset,
        rulesSetDispatch,
        playerIds,
        playerIdsDispatch,
      }}
    >
      <div className="">
        <Switch>
          <Route exact path="/game">
            <GameHome />
          </Route>
          <Route exact path="/game/matchmaking">
            <GameMatchmaking />
          </Route>
          <Route exact path="/game/create">
            <GameCreate />
          </Route>
        </Switch>
      </div>
    </GameContext.Provider>
  );
}

export default Game;
