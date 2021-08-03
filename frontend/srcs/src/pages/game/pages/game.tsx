import { Route, Switch } from "react-router";

import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";
import { GameContext } from "../context";
import { Pong } from "./pong";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../components/utilities/getSocket";

function Game() {
  const [gameSocket, setGameSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const onGameSocketConnection = (socket: Socket) => {
      // TODO: Register event callbacks here
      console.log("TODO: Game socket connected!");
    };

    const socket = getSocket("/matches", onGameSocketConnection);

    setGameSocket(socket);

    return () => {
      //socket?.close();
    };
  }, []);

  console.log("Game is present");

  return (
    <GameContext.Provider
      value={{
        gameSocket,
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
          <Route path="/game/:id" component={Pong} />
        </Switch>
      </div>
    </GameContext.Provider>
  );
}

export default Game;
