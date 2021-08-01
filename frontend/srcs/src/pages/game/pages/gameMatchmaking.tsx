import { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { GameContext, IGameContext } from "../context";
import {
  ClientMessages,
  ServerMessages,
} from "../dto/messages";

function GameMatchmaking() {
  const context: IGameContext = useContext(GameContext);

  const history = useHistory();

  const [inQueue, setInQueue] = useState<boolean>(false);

  const findGame = () => {
    setInQueue(true);
    console.log(`[FRONTEND] clicked on findGame: InQueue: ${inQueue}`);
    context.gameSocket?.emit(ServerMessages.FIND_GAME);
  };

  const cancelSearch = () => {
    setInQueue(false);
    console.log(`[FRONTEND] cicked on cancelSearch: InQueue: ${inQueue}`);
    context.gameSocket?.emit(ServerMessages.CANCEL_FIND);
  };

  const quitToHome = () => {
    if (inQueue)
      cancelSearch();
    history.push('/game');
  };

  const onNotify = (msg: string) => {
    console.log(msg);
  };

  useEffect(() => {
    const deleteSubscribedListeners = () => {
      if (context.gameSocket) {
        context.gameSocket.off(ClientMessages.NOTIFY, onNotify);
      }
    };

    if (context.gameSocket) {
      context.gameSocket.on(ClientMessages.NOTIFY, onNotify);
    }
    return deleteSubscribedListeners;
  }, [context.gameSocket]);



  const buttonClassname = "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'md:text-2xl text-lg font-bold text-gray-900'

  return (
    <div className='grid justify-center'>
      <div className='inline-block max-w-sm px-2 py-8 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg md:max-w-xl md:px-12'>
        <div className='flex justify-center mb-8 text-2xl font-bold md:text-3xl '>
          Matchmaking
        </div>
        <div className="flex w-auto space-x-8 rounded-md lg:space-x-24">
          <button
            className={buttonClassname + " bg-green-300 hover:bg-green-400"}
            // to='game/matchmaking'
            onClick={() => findGame()}
            disabled={inQueue ? true : undefined}
          >
            <span className={textButtonClassname}>Find a Game</span>
          </button>
          <button
            className={buttonClassname + " bg-red-400 hover:bg-red-500"}
            // to='game/create'
            onClick={() => cancelSearch()}
            disabled={inQueue ? undefined : true}
          >
            <span className={textButtonClassname}>Cancel search</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <NavLink
          className={
            buttonClassname + " bg-secondary hover:bg-secondary-dark mt-8 w-32"
          }
          to="/game"
          onClick={() => quitToHome()}
        >
          <span className={textButtonClassname}>Quit</span>
        </NavLink>
      </div>
    </div>
  );
}

export default GameMatchmaking;
