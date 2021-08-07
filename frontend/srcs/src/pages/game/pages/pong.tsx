import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import AppContext from "../../../AppContext";
import { GameJoinedDto } from "../../../models/game/GameJoined.dto";
import { GameRole } from "../../../models/game/GameRole";
import { GameState, GameStatus } from "../../../models/game/GameState";
import { ClientMessages, ServerMessages } from "../dto/messages";
import { getDefaultBall, pongEngine } from "../engine/engine";
import { renderize } from "../engine/render";
import { canvasHeight, canvasWidth, whRatio } from "../../../models/game/canvasDims";
import { Events } from "../../../models/channel/Events";
import { Player } from "../../../models/game/Player";
import { Ball, IBall } from "../../../models/game/Ball";
import Popup from "reactjs-popup";
import { ruleOfThree } from "../engine/engine"
import { GameResults } from "../../../models/game/GameResults";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Loading from "../../../components/loading/loading";
import { Vector2D } from "../../../models/game/Vector2D";

export type PongPageParams = {
  id: string;
};

enum Received {
  STATUS = (1 << 0),
  PLAYERS = Received.STATUS << 1,
  SCORES = Received.PLAYERS << 1,
  BALL = Received.SCORES << 1
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

  const widthMargin = 50;

  const [finalData, setFinalData] = useState<GameResults>({
    playersId: [0, 0],
    scores: [0, 0],
    playersName: ['', '']
  });

  useEffect(() => {
    if (canvasRef.current !== null)
      ctx.current = canvasRef.current.getContext("2d");

    // const windowResizeEventHandler = () => {
    //   //console.log("[pong.tsx] Resize screen");

    //   // TO DO: SEEMS THIS CAN BE DONE IN 2 LINES (not need "if" just init h diferently)

    //   let h = window.innerHeight * 3 / 4;
    //   let w = h * whRatio;

    //   if (w > (window.innerWidth - widthMargin)) {
    //     w = window.innerWidth - widthMargin;
    //     h = w / whRatio;
    //   }
    //   setCanvSize({
    //     h: h,
    //     w: w
    //   })
    // };

    // window.addEventListener('resize', windowResizeEventHandler);

    // return () => { window.removeEventListener('resize', windowResizeEventHandler); };

  }, []);

  useEffect(() => {
    setGameFinished(false);
    setWaitingScreen(false);
    setIsPlayer(false);
    setNoGame(false);
    setOpen(true);
  }, [match.params.id])

  useEffect(() => {

    if (
      matchSocket === undefined ||
      canvasRef.current === null ||
      ctx.current === null
    ) {
      console.log('return early in useEffect Pong')
      return;
    }

    let received: number = 0;
    let state: GameState = {
      status: GameStatus.UNREADY,
      players: [],
      scores: [0, 0],
      ball: getDefaultBall()
    };
    let animationId: number | undefined = 0;
    let updateIntervalHandle: NodeJS.Timeout | undefined = undefined;

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

      // TO DO: Emit mouse pos only if mouse is in the canvas
      matchSocket?.volatile.emit(ServerMessages.UPDATE_MOUSE_POS, {
        x: player.x,
        y: player.y,
      });
    };

    const onJoined = (data: GameJoinedDto) => {
      console.log(`[pong.tsx] onJoined: role ${data.role}`);

      if (data.role === GameRole.Player) {
        setIsPlayer(true);
        canvasRef.current!.addEventListener("mousemove", mouseEventHandler);
        matchSocket?.emit(ServerMessages.PLAYER_READY);
        setWaitingScreen(true);
      }
      else
        setWaitingScreen(false);
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

      // players.forEach((player) => {
      //   player.y = ruleOfThree(player.y, canvSize.h);
      //   player.x = ruleOfThree(player.x, canvSize.h);
      //   player.height = ruleOfThree(player.height, canvSize.h);
      //   player.width = ruleOfThree(player.width, canvSize.h);
      // });

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
          y: ball.y
        },
        {
          x: ball.dir.x,
          y: ball.dir.y
        },
        ball.rad,
        ball.velocity
      );

      state.ball.defaultBall = getDefaultBall();

      // TO DO: This is a temporally solution ! Should not need this line !!!
      state.ball.rad = state.ball.defaultBall.rad;

      if (received === (Received.STATUS | Received.PLAYERS | Received.SCORES)) {
        received = 0;
        if (animationId !== undefined) {
          if (state.status === GameStatus.RUNNING) {
            animationId = requestAnimationFrame(frame);
          } else if (state.status === GameStatus.PAUSED) {
            cancelAnimationFrame(animationId);
            clearInterval(updateIntervalHandle!);
          } else if (state.status === GameStatus.FINISHED) {
            cancelAnimationFrame(animationId);
            clearInterval(updateIntervalHandle!);
            animationId = undefined;
          }
        }
      }
    };

    const onMatchStart = () => {
      console.log("[pong.tsx] Game has started");
      appSocket?.emit(Events.Server.StartGame, { roomId: match.params.id });
      setWaitingScreen(false);
      updateIntervalHandle = setInterval(() => {
        //console.log(`[pong.tsx] ball rad: ${state.ball.rad}`);
        pongEngine(state);
      }, 3);
    };

    const setEndGameData = async (
      winnerIndex: number,
    ) => {
      try {
        setFinalData({
          playersId: [state.players[winnerIndex].id, state.players[1 - winnerIndex].id],
          scores: [state.scores[winnerIndex], state.scores[1 - winnerIndex]],
          playersName: ['', '']
        })
      } catch (error) { console.log(error) }
    };

    // const onMatchEnd = async (data: { playerNames: string[] }) => {
    const onMatchEnd = async () => {
      console.log("[pong.tsx] Game is finished - state: ", state);
      const winnerIndex = state.scores[0] >= state.scores[1] ? 0 : 1
      // await setEndGameData(winnerIndex, data.playerNames);
      await setEndGameData(winnerIndex);
      setGameFinished(true);
      appSocket?.emit(Events.Server.EndGame, { room: match.params.id });
    };

    const ifNoGame = () => {
      console.log("[pong.tsx] No current game");
      if (!noGame) {
        setNoGame(true);
      }
    }

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

    // updateIntervalHandle = setInterval(() => {
    //   //console.log(`[pong.tsx] ball rad: ${state.ball.rad}`);
    //   pongEngine(state, canvSize.h);
    // }, 3);

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

    matchSocket?.emit(ServerMessages.JOIN_ROOM, { roomId: Number(match.params.id) });

    return deleteSubscribedListeners;
  }, [user?.id, matchSocket, appSocket, history, match.params.id,
    noGame
  ]);

  useEffect(() => {
    const setPlayerNamesData = async () => {
      if (finalData.playersId[0] && finalData.playersId[1] && (!finalData.playersName[0] || !finalData.playersName[0].length)) {
        try {
          const data0 = await axios.get("/api/users/" + finalData.playersId[0]);
          const data1 = await axios.get("/api/users/" + finalData.playersId[1]);
          setFinalData({
            ...finalData,
            playersName: [data0.data.name, data1.data.name]
          })
        } catch (error) { console.log(error) }
      }
    }
    setPlayerNamesData()
  }, [finalData])

  // useEffect(() => {
  //   console.log('useEffect - gameFinished', gameFinished)
  // }, [gameFinished])

  // useEffect(() => {
  //   console.log('useEffect - waitingScreen', waitingScreen)
  // }, [waitingScreen])

  // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

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
    history.push('/game');
  }

  const giveUpGame = () => {
    matchSocket?.emit(ServerMessages.PLAYER_GIVEUP);
    setGiveUpDisplay(false);
    // closeModal();
  }

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
        <div className='flex space-x-8'>
          <button
            className={buttonClassname + " bg-red-600 hover:bg-red-700"}
            onClick={giveUpGame}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>Give up, really?</span>
          </button>
          <button
            className={buttonClassname + " bg-secondary hover:bg-secondary-dark w-12"}
            onClick={() => setGiveUpDisplay(false)}
            disabled={!giveUpDisplay}
          >
            <span className={textButtonClassname}>No</span>
          </button>
        </div>
      )
    }
  }

  const buttonClassname =
    "flex justify-center rounded-lg py-2 px-2 h-8 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap" +
    " items-center my-2";
  const textButtonClassname = "text-lg font-bold text-gray-900";


  const displayWaitingScreen = () => {
    if (waitingScreen) {
      return (
        <div className='fixed grid top-12 left-0 z-50 w-screen h-screen bg-gray-700 opacity-70 justify-center'>
          <div className='w-72 h-32 bg-primary rounded-md grid justify-center mt-12'>
            <span className="font-bold text-xl mb-2 mt-4">
              Waiting for the game...
            </span>
            <Loading hideText />
          </div>
        </div>
      )
    }
  }

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
    )
    // }
  }

  const displayGame = () => {
    return (
      <div>
        <Popup open={open} closeOnDocumentClick onClose={giveUpGame}>
          <div className=" fixed top-0 left-0 z-30 overflow-auto bg-gray-700 flex w-screen h-screen bg-opacity-70">
            {!gameFinished ? displayCurrentGame() : displayFinishedBoard()}
          </div>
        </Popup>
      </div >
    );
  };

  const displayCurrentGame = () => {
    return (
      <div className=' bg-red-500 h-12'>
        <div className="fixed top-0 left-0 z-50 w-full justify-center grid">
          {displayGiveUpButton()}
          {displayGiveUpConfirmationButton()}
        </div>
        {displayWaitingScreen()}
        <div className='fixed top-0 left-0 z-40  w-screen h-screen pb-16/9'>
          <div className=' mt-12 w-screen grid justify-center'>
            {displayCanvas()}
          </div>
        </div>
      </div>
    )
  }

  const displayWinOrLosePicture = () => {
    const path = finalData.scores[0] === finalData.scores[1]
      ? "/api/uploads/exaequo.png"
      : (finalData.playersId[1] === user?.id
        ? "/api/uploads/lose.png"
        : "/api/uploads/win.png")
    return (
      <img
        className="object-contain w-100% h-24"
        src={path}
        alt="win or lose"
      />
    )
  }

  const displayScores = () => {
    if (finalData.scores[1] === -1) {
      return (
        <div className="flex justify-center text-center mb-4 text-2xl font-bold md:text-3xl break-words">
          Forfeit
        </div>
      )
    } else {
      return (
        <div className="flex justify-center text-center mb-4 text-2xl font-bold md:text-3xl break-words">
          Scores:
          <br />
          {finalData.scores[0]} - {finalData.scores[1]}
        </div>
      )
    }
  }

  const displayWinnerName = () => {
    if (finalData.scores[0] > finalData.scores[1]) {
      return (
        <div className="flex justify-center text-center mb-4 text-2xl font-bold md:text-3xl break-words">
          Winner
          <br />
          {finalData.playersName[0]}
        </div>
      )
    } else {
      return (
        <div className="flex justify-center text-center mb-4 text-2xl font-bold md:text-3xl break-words">
          Ex aequo
        </div>
      )
    }
  }

  const displayFinishedBoard = () => {
    return (
      <div className='grid justify-center w-screen '>
        <div className="align-center inline-block w-72 h-96 max-w-sm px-2 py-8 mt-16 mb-8 border-2 border-gray-300 rounded-lg bg-neutral md:px-12 md:max-w-lg">
          {displayWinnerName()}
          {displayScores()}
          <div className="flex w-auto justify-center space-x-8 rounded-md lg:space-x-24">
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
    )
  }

  //const height: number = window.screen.height / 2;//canvasRef.current?.height!;
  if (noGame) {
    return (
      <div className='font-semibold w-full text-center mt-16'>There is no current game in this room</div>
    )
  }
  else {
    return (
      displayGame()
    );
  }
}
