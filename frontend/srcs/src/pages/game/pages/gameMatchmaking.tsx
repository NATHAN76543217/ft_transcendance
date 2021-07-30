import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { GameContext, IGameContext } from "../context";
import { ClientMessages, ServerMessages, IAcknowledgement } from "../dto/messages";

function GameMatchmaking() {

  const context : IGameContext = useContext(GameContext);

  // TO DO: "Cancel Search" is disabled if "Find Match" ins't
  // TO DO: Same for "Find Match"

  const findGame = () => {
    // TO DO: Be sure that playersIds[0] is the current player id
    context.socket?.emit(ServerMessages.FIND_GAME, context.playerIds[0]); 
  };

  const cancelSearch = () => {
    // TO DO: Be sure that playersIds[0] is the current player id
    context.socket?.emit(ServerMessages.CANCEL_FIND, context.playerIds[0], (response : IAcknowledgement) => {
      if (response.status === "not ok")
        throw new Error(); // TO DO: What could happend if somehow this condition is true ?
    }); 
  };

  const quitToHome = () => {
    // If player is in queue cancel the queue either just swicth back the pages
  };

  const onNotify = (msg : string) => {
    console.log(msg);
  };

  const onMatchFound = () => {
    // TO DO: Go to the game
  };

  const deleteSubscribedListeners = () => {
    if (context.socket) {
      context.socket.off(ClientMessages.MATCH_FOUND, onMatchFound);
      context.socket.off(ClientMessages.NOTIFY, onNotify);
    }
  };

  useEffect(() => {
    if (context.socket) {
      context.socket.once(ClientMessages.MATCH_FOUND, onMatchFound);
      context.socket.on(ClientMessages.NOTIFY, onNotify);
    }
      return deleteSubscribedListeners;
  }, []);



  const buttonClassname = "flex justify-center rounded-lg py-2 px-4 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto"
  const textButtonClassname = 'md:text-2xl text-lg font-bold text-gray-900'

  return (
    <div className='grid justify-center'>
      <div className='inline-block max-w-sm px-2 py-8 mt-24 bg-blue-200 border-2 border-gray-300 rounded-lg md:max-w-xl md:px-12'>
        <div className='flex justify-center mb-8 text-2xl font-bold md:text-3xl '>
          Matchmaking
        </div>
        <div className='flex w-auto space-x-8 rounded-md lg:space-x-24'>
          <button
            className={buttonClassname + ' bg-green-300 hover:bg-green-400'}
            // to='game/matchmaking'
            onClick={() => findGame()}
          >
            <span className={textButtonClassname}>Find a Game</span>
          </button>
          <button
            className={buttonClassname + ' bg-red-400 hover:bg-red-500'}
            // to='game/create'
            onClick={() => cancelSearch()}
          >
            <span className={textButtonClassname}>Cancel search</span>
          </button>
        </div>
      </div>
      <div className='flex justify-center'>

        <NavLink
          className={buttonClassname + ' bg-secondary hover:bg-secondary-dark mt-8 w-32'}
          to='/game'
          onClick={() => quitToHome()}
        >
          <span className={textButtonClassname}>Quit</span>
        </NavLink>
      </div>
    </div>
  );
}

export default GameMatchmaking;
