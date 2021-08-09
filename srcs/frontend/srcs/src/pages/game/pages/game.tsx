import { Route, Switch } from "react-router";

import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";
import { Pong } from "./pong";
import { useContext } from "react";
import AppContext from "../../../AppContext";
import Loading from "../../../components/loading/loading";

function Game() {
  const { matchSocket } = useContext(AppContext);

  //console.log("matchSocket", matchSocket);

  if (matchSocket === undefined) {
    return <Loading></Loading>;
  }

  //console.log("Game is present");

  return (
    <div className="h-full">
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
        <Route path="/game/:id" component={Pong} />
      </Switch>
    </div>
  );
}

export default Game;
