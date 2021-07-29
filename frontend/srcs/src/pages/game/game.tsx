import React from "react";
import { Route, Switch } from "react-router";
import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";

function Game() {

  return (
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
  );
}

export default Game;
