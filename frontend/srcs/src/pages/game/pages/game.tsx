import {useReducer} from "react"
import { Route, Switch } from "react-router";

import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";
import { defaultGameState, defaultRuleSet, GameContext, GameState, RuleSet } from "../context"

export enum Action {

}

function stateReducer(state : GameState, action : { type: Action} ) {
    switch(action.type)
    {
        default:
            return state;
    }
}

function ruleSetReducer(state : RuleSet, action : { type: Action} ) {
    switch(action.type)
    {
        default:
            return state;
    }
}

function playerIdsReducer(state : number [], action : { type: Action} ) {
    switch(action.type)
    {
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
  const [ruleSet, rulesSetDispatch] = useReducer(ruleSetReducer, defaultRuleSet);
  const [playerIds, playerIdsDispatch] = useReducer(playerIdsReducer, []);

  console.log("Game is present");

  return (
      <GameContext.Provider value={{state, stateDispatch, ruleSet, rulesSetDispatch, playerIds, playerIdsDispatch}}>
        <div className="">
          <Switch>
            <Route exact path="/game">
              <GameHome/>
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
