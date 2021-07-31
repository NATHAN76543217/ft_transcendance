import { Route, Switch } from "react-router";

import GameCreate from "./gameCreate";
import GameHome from "./gameHome";
import GameMatchmaking from "./gameMatchmaking";
import { GameContext } from "../context";
import { Pong } from "./pong";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

function getGameSocket() {
  console.log("Initiating game-socket connection...");

  const socket = io("", {
    path: "/api/socket.io/matches",
    rejectUnauthorized: false, // This disables certificate authority verification
    withCredentials: true,
  }).on("authenticated", () => {
    console.log("Game-socket connection authenticated!");
  });

  return socket;
}

function Game() {
  const [gameSocket, setGameSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const socket = getGameSocket();

    setGameSocket(socket);

    return () => {
      socket?.close();
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
