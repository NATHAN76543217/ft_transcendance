import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { getDefaultBall, pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import { canvasHeight, canvasWidth } from "../../../models/game/canvasDims";
import { Events } from "../../../models/channel/Events";
import { Player } from "../../../models/game/Player";
import { Ball, IBall } from "../../../models/game/Ball";
import Popup from "reactjs-popup";
import { GameResults } from "../../../models/game/GameResults";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Loading from "../../../components/loading/loading";
import { Vector2D } from "../../../models/game/Vector2D";

export type PongPageParams = {
  id: string;
};

enum Received {
  STATUS = 1 << 0,
  PLAYERS = Received.STATUS << 1,
  SCORES = Received.PLAYERS << 1,
  BALL = Received.SCORES << 1,
}

export function Pong({ match }: RouteComponentProps<PongPageParams>) {
  const { user, eventSocket: appSocket, relationshipsList } = useContext(AppContext);
  const { matchSocket } = useContext(AppContext);
  const history = useHistory();

  const [gameFinished, setGameFinished] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [noGame, setNoGame] = useState(false);
  const [waitingScreen, setWaitingScreen] = useState(false);

  const [open, setOpen] = useState(true);
  const closeModal = () => setOpen(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const [finalData, setFinalData] = useState<GameResults>({
    playersId: [0, 0],
    scores: [0, 0],
    playersName: ["", ""],
  });

  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    setGameFinished(false);
    setWaitingScreen(false);
    setIsPlayer(false);
    setNoGame(false);
    setOpen(true);
  }, [match.params.id]);

  useEffect(() => {
    if (
      matchSocket === undefined ||
      canvasRef.current === null ||
      ctx.current === null
    ) {
      return;
    }

    let received: number = 0;
    let state: GameState = {
      status: GameStatus.UNREADY,
      players: [],
      scores: [0, 0],
      ball: getDefaultBall(),
    };
    let animationId: number | undefined = undefined;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;
    let paused : boolean = false;

    const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return new Vector2D(
        (evt.clientX - rect.left) * scaleX,
        (evt.clientY - rect.top) * scaleY
      );
    };

    const mouseEventHandler = (event: MouseEvent) => {
      const player = state.players.find((player) => player.id === user?.id);

      if (player === undefined) return;
      const mousePos = getMousePos(canvasRef.current!, event);

      player.y = mousePos.y;

      matchSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
        x: player.x,
        y: player.y,
      });
    };

    const onJoined = (data: GameJoinedDto) => {
      //console.log(`[pong.tsx] onJoined: role ${data.role}`);

      if (data.role === GameRole.Player) {
        setIsPlayer(true);
        canvasRef.current!.addEventListener("mousemove", mouseEventHandler);
        matchSocket?.emit(ServerMessages.PLAYER_READY);
        setWaitingScreen(true);
      } else {
        setWaitingScreen(false);
        animationId = 0;
      }
    };

    const onQuit = () => {
      // matchSocket?.emit(ServerMessages.PLAYER_GIVEUP);
      // history.push("/game");
    };

    const onReceiveStatus = (status: GameStatus) => {
      state.status = status;
      received |= Received.STATUS;
    };

    const onReceivePlayers = (players: Player[]) => {
      state.players = players;
      received |= Received.PLAYERS;
    };

    const onReceiveScores = (scores: number[]) => {
      state.scores = scores;
      received |= Received.SCORES;
    };

    const onReceiveBall = (ball: IBall) => {
      state.ball = new Ball(
        {
          x: ball.x,
          y: ball.y,
        },
        {
          x: ball.dir.x,
          y: ball.dir.y,
        },
        ball.velocity,
        ball.rad
      );

      state.ball.defaultBall = getDefaultBall();

      // console.log("[pong.tsx] Receiving ball ...");
      if (received === (Received.STATUS | Received.PLAYERS | Received.SCORES)) {
        received = 0;
        // console.log("[pong.tsx] Animation id is not 0");
        if (animationId !== undefined) {
          if (state.status === GameStatus.RUNNING) {
            if (updateIntervalHandle === undefined) {
              // console.log("[pong.tsx] Launch animation frame");
              animationId = requestAnimationFrame(frame);
              launchEngine();
            } else if (paused === true) {
              clearInterval(updateIntervalHandle);
              setTimeout(launchEngine, 3 * 1000);
              paused = false;
            }
          } else {
            cancelAnimationFrame(animationId);
            clearInterval(updateIntervalHandle!);
            paused = true;
            //updateIntervalHandle = undefined;
            if (state.status === GameStatus.FINISHED) {
              animationId = undefined;
            }
          }
        }
      }
    };

    const launchEngine = () => {
      updateIntervalHandle = setInterval(() => {
        pongEngine(state);
      }, 20);
    };

    const onMatchStart = () => {
      //console.log("[pong.tsx] Game has started");
      animationId = 0;
      if (updateIntervalHandle === undefined) {
        appSocket?.emit(Events.Server.StartGame, { roomId: match.params.id });
        setWaitingScreen(false);
      } 
    };

    const setEndGameData = async (winnerIndex: number) => {
      try {
        setFinalData({
          playersId: [
            state.players[winnerIndex].id,
            state.players[1 - winnerIndex].id,
          ],
          scores: [state.scores[winnerIndex], state.scores[1 - winnerIndex]],
          playersName: ["", ""],
        });
      } catch (error) {
        //console.log(error);
      }
    };

    // const onMatchEnd = async (data: { playerNames: string[] }) => {
    const onMatchEnd = async () => {
      //console.log("[pong.tsx] Game is finished - state: ", state);
      const winnerIndex = state.scores[0] >= state.scores[1] ? 0 : 1;
      // await setEndGameData(winnerIndex, data.playerNames);
      await setEndGameData(winnerIndex);
      setGameFinished(true);
      appSocket?.emit(Events.Server.EndGame, { room: match.params.id });
    };

    const ifNoGame = () => {
      //console.log("[pong.tsx] No current game");
      if (!noGame) {
        setNoGame(true);
      }
    };

    const deleteSubscribedListeners = () => {
      if (updateIntervalHandle) {
        clearInterval(updateIntervalHandle);
      }
      matchSocket
        ?.off(ClientMessages.JOINED, onJoined)
        .off(ClientMessages.RECEIVE_STATUS, onReceiveStatus)
        .off(ClientMessages.RECEIVE_PLAYERS, onReceivePlayers)
        .off(ClientMessages.RECEIVE_SCORES, onReceiveScores)
        .off(ClientMessages.RECEIVE_BALL, onReceiveBall)
        .off(ClientMessages.QUIT, onQuit)
        .off(ClientMessages.GAME_START, onMatchStart)
        .off(ClientMessages.GAME_END, onMatchEnd)
        .off(ClientMessages.NO_GAME, ifNoGame);

      window.removeEventListener("mousemove", mouseEventHandler);
    };

    const frame = () => {
      renderize(state, ctx.current!);
      requestAnimationFrame(frame);
    };

    matchSocket
      ?.on(ClientMessages.JOINED, onJoined)
      .on(ClientMessages.RECEIVE_STATUS, onReceiveStatus)
      .on(ClientMessages.RECEIVE_PLAYERS, onReceivePlayers)
      .on(ClientMessages.RECEIVE_SCORES, onReceiveScores)
      .on(ClientMessages.RECEIVE_BALL, onReceiveBall)
      .on(ClientMessages.QUIT, onQuit)
      .on(ClientMessages.GAME_START, onMatchStart)
      .on(ClientMessages.GAME_END, onMatchEnd)
      .on(ClientMessages.NO_GAME, ifNoGame);

    matchSocket?.emit(ServerMessages.JOIN_ROOM, {
      roomId: Number(match.params.id),
    });

    return deleteSubscribedListeners;
  }, [user?.id, matchSocket, appSocket, history, match.params.id, noGame]);

  useEffect(() => {
    const setPlayerNamesData = async () => {
      if (finalData.playersId[0] && finalData.playersId[1] && (!finalData.playersName[0] || !finalData.playersName[0].length)) {
        try {
          const data0 = await axios.get("/api/users/" + finalData.playersId[0]);
          const data1 = await axios.get("/api/users/" + finalData.playersId[1]);
          setFinalData({
            ...finalData,
            playersName: [data0.data.name, data1.data.name],
          });
        } catch (error) {
          // console.log(error);
        }
      }
    };
    setPlayerNamesData();
  }, [finalData]);

  const cancelGameRequest = async () => {
    const relation = relationshipsList.find((relation) => {
      if (relation.gameInvite) {
        return relation.gameInvite.sender_id === user?.id
      } else {
        return false;
      }
    })
    if (relation) {
      try {
        await axios.delete(`/api/matches/${relation.gameInvite?.data}`);
        await axios.delete(`/api/messages/${relation.gameInvite?.id}`);
        history.push(`/`);
      } catch (e) {
        history.push(`/`);
        console.error(e);
      }
    }
  };

  const quitGameAsSpectator = () => {
    setGiveUpDisplay(false);
    closeModal();
    history.push("/game");
  };

  const giveUpGame = () => {
    matchSocket?.emit(ServerMessages.PLAYER_GIVEUP);
    setGiveUpDisplay(false);
    // closeModal();
  };

  const [giveUpDisplay, setGiveUpDisplay] = useState(false);

  const displayGiveUpButton = () => {
    if (!isPlayer) {
      return (
        <button
          className={buttonClassname + " bg-red-600 hover:bg-red-700"}
          onClick={quitGameAsSpectator}
        // disabled={!giveUpDisplay}
        >
          <span className={textButtonClassname}>Quit</span>
        </button>
      )
    } else if (waitingScreen) {
      return (
        <button
          className={buttonClassname + " bg-red-600 hover:bg-red-700"}
          onClick={cancelGameRequest}
          disabled={giveUpDisplay}
        >
          <span className={textButtonClassname}>Cancel invitation</span>
        </button>
      )
    } else if (!giveUpDisplay) {
      return (
        <button
          className={buttonClassname + " bg-red-600 hover:bg-red-700"}
          onClick={() => setGiveUpDisplay(true)}
          disabled={giveUpDisplay}
        >
          <span className={textButtonClassname}>Give up</span>
        </button>
      )
    }
  }

  const displayGiveUpConfirmationButton = () => {
    if (giveUpDisplay) {
      return (
        <div className="flex space-x-8">
          <button
            className={buttonClassname + " bg-red-600 hover:bg-red-700"}
            onClick={giveUpGame}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>Give up, really?</span>
          </button>
          <button
            className={
              buttonClassname + " bg-secondary hover:bg-secondary-dark w-12"
            }
            onClick={() => setGiveUpDisplay(false)}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>No</span>
          </button>
        </div>
      );
    }
  };

  const buttonClassname =
    "flex justify-center rounded-lg py-2 px-2 h-8 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap" +
    " items-center my-2";
  const textButtonClassname = "text-lg font-bold text-gray-900";

  const displayWaitingScreen = () => {
    if (waitingScreen) {
      return (
        <div className="fixed left-0 z-50 grid justify-center w-screen h-full bg-gray-700 top-12 opacity-70">
          <div className="grid justify-center h-32 mt-12 rounded-md w-72 bg-primary">
            <span className="mt-4 mb-2 text-xl font-bold">
              Waiting for the game...
            </span>
            <Loading hideText />
          </div>
        </div>
      );
    }
  };

  const displayCanvas = () => {
    // if (!waitingScreen) {
    return (
      <canvas
        ref={canvasRef}
        height={canvasHeight}
        width={canvasWidth}
        className="w-full"
        // hidden={waitingScreen}
      />
    );
    // }
  };

  const displayGame = () => {
    return (
      <div>
        <Popup open={open} closeOnDocumentClick onClose={giveUpGame}>
          <div className="fixed top-0 left-0 z-30 flex w-screen h-full overflow-auto bg-gray-700 bg-opacity-70">
            {!gameFinished ? displayCurrentGame() : displayFinishedBoard()}
          </div>
        </Popup>
      </div>
    );
  };

  const displayCurrentGame = () => {
    return (
      <div className="h-12 bg-red-500 ">
        <div className="fixed top-0 left-0 z-50 grid justify-center w-full">
          {displayGiveUpButton()}
          {displayGiveUpConfirmationButton()}
        </div>
        {displayWaitingScreen()}
        <div className="fixed top-0 left-0 z-40 w-screen h-full pb-16/9">
          <div className="grid justify-center w-screen mt-12 ">
            {displayCanvas()}
          </div>
        </div>
      </div>
    );
  };

  const displayWinOrLosePicture = () => {
    const path =
      finalData.scores[0] === finalData.scores[1]
        ? "/api/uploads/exaequo.png"
        : finalData.playersId[1] === user?.id
        ? "/api/uploads/lose.png"
        : "/api/uploads/win.png";
    return (
      <img
        className="object-contain w-100% h-24"
        src={path}
        alt="win or lose"
      />
    );
  };

  const displayScores = () => {
    if (finalData.scores[1] === -1) {
      return (
        <div className="flex justify-center mb-4 text-2xl font-bold text-center break-words md:text-3xl">
          Forfeit
        </div>
      );
    } else {
      return (
        <div className="flex justify-center mb-4 text-2xl font-bold text-center break-words md:text-3xl">
          Scores:
          <br />
          {finalData.scores[0]} - {finalData.scores[1]}
        </div>
      );
    }
  };

  const displayWinnerName = () => {
    if (finalData.scores[0] > finalData.scores[1]) {
      return (
        <div className="flex justify-center mb-4 text-2xl font-bold text-center break-words md:text-3xl">
          Winner
          <br />
          {finalData.playersName[0]}
        </div>
      );
    } else {
      return (
        <div className="flex justify-center mb-4 text-2xl font-bold text-center break-words md:text-3xl">
          Ex aequo
        </div>
      );
    }
  };

  const displayFinishedBoard = () => {
    return (
      <div className="grid justify-center w-screen ">
        <div className="inline-block max-w-sm px-2 py-8 mt-16 mb-8 border-2 border-gray-300 rounded-lg align-center w-72 h-96 bg-neutral md:px-12 md:max-w-lg">
          {displayWinnerName()}
          {displayScores()}
          <div className="flex justify-center w-auto space-x-8 rounded-md lg:space-x-24">
            {displayWinOrLosePicture()}
          </div>
          <div className="flex justify-center ">
            <NavLink
              className={
                buttonClassname +
                " bg-secondary hover:bg-secondary-dark mt-8 w-32"
              }
              to="/game"
              onClick={() => history.push("/game")}
            >
              <span className={textButtonClassname}>Quit</span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  };

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  if (noGame) {
    return (
      <div className="w-full mt-16 font-semibold text-center">
        There is no current game in this room
      </div>
    );
  } else {
    return displayGame();
  }
}
