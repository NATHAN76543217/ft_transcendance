import { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Popup from "reactjs-popup";
import Loading from "../../../components/loading/loading";
import { GameContext, IGameContext } from "../context";
import { ClientMessages, ServerMessages } from "../dto/messages";

function GameMatchmaking() {
  const context: IGameContext = useContext(GameContext);

  const history = useHistory();

  const [inQueue, setInQueue] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const findGame = () => {
    setOpen((o) => !o);
    setInQueue(true);
    console.log(`[FRONTEND] clicked on findGame: InQueue: ${inQueue}`);
    context.gameSocket?.emit(ServerMessages.FIND_GAME);
  };

  const cancelSearch = () => {
    setInQueue(false);
    console.log(`[FRONTEND] cicked on cancelSearch: InQueue: ${inQueue}`);
    context.gameSocket?.emit(ServerMessages.CANCEL_FIND);
    closeModal();
  };

  const quitToHome = () => {
    if (inQueue) cancelSearch();
    history.push("/game");
  };

  const displayMatchSearch = () => {
    return (
      <div>
        <Popup open={open} closeOnDocumentClick onClose={cancelSearch}>
          <div className="fixed top-0 left-0 z-50 overflow-auto bg-gray-700 flex w-screen h-screen bg-opacity-70">
            <div className="absolute grid w-96 top-32 left-[15%] md:left-[20%] lg:left-[30%] xl:left-[40%] mx-auto px-4 py-8 h-60 z-50 bg-primary justify-center text-center ">
              <span className="font-bold text-xl mb-4">
                Looking for an opponent...
              </span>
              <Loading hideText />
              <div className="w-full justify-center grid">
                <button
                  className={
                    buttonClassname +
                    " bg-red-400 hover:bg-red-500 items-center mt-4 w-48"
                  }
                  onClick={cancelSearch}
                  disabled={inQueue ? undefined : true}
                >
                  <span className={textButtonClassname}>Cancel search</span>
                </button>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    );
  };

  useEffect(() => {
    const onNotify = (msg: string) => {
      console.log(msg);
    };

    const goToGamePage = (id: number) => {
      //cancelSearch();
      history.push(`/game/${id}`);
    };

    const deleteSubscribedListeners = () => {
      if (context.gameSocket) {
        context.gameSocket
          .off(ClientMessages.NOTIFY, onNotify)
          .off(ClientMessages.MATCH_FOUND, goToGamePage);
      }
    };

    if (context.gameSocket) {
      context.gameSocket
        .on(ClientMessages.NOTIFY, onNotify)
        .on(ClientMessages.MATCH_FOUND, goToGamePage);
    }
    return deleteSubscribedListeners;
  }, [context.gameSocket, history]);

  const buttonClassname =
    "flex justify-center rounded-lg py-2 px-4 h-12 " +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto";
  const textButtonClassname = "md:text-2xl text-lg font-bold text-gray-900";

  return (
    <div className="relative grid justify-center h-screen align-top">
      <div className="grid mt-24 max-w-sm h-64 px-2 py-8 bg-blue-200 border-2 border-gray-300 rounded-lg md:max-w-xl md:px-12">
        <div className="flex justify-center mb-8 text-2xl font-bold md:text-3xl ">
          Matchmaking
        </div>
        <div className="flex justify-center w-auto space-x-8 rounded-md lg:space-x-24">
          <button
            type="button"
            className={buttonClassname + " bg-green-300 hover:bg-green-400"}
            onClick={findGame}
            disabled={inQueue ? true : undefined}
          >
            <span className={textButtonClassname}>Find a Game</span>
          </button>
        </div>
        <div className="flex justify-center ">
          <NavLink
            className={
              buttonClassname +
              " bg-secondary hover:bg-secondary-dark mt-8 w-32"
            }
            to="/game"
            onClick={() => quitToHome()}
          >
            <span className={textButtonClassname}>Quit</span>
          </NavLink>
        </div>
      </div>
      {displayMatchSearch()}
    </div>
  );
}

export default GameMatchmaking;
