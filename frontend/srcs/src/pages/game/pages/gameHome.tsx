import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import CurrentMatchItem from "../../../components/matchHistory/currentMatchItem";
import { IMatch } from "../../../models/match/IMatch";

function GameHome() {
  const [matchList, setMatchList] = useState<IMatch[]>([]);

  const getPlayerName = async (user_id: number) => {
    if (!user_id) {
      return "Unknown player";
    }
    try {
      const dataUser = await axios.get(`/api/users/${user_id}`);
      return dataUser.data.name;
    } catch (error) {
      console.log(error);
      return "Unknown";
    }
  };

  const getAllCurrentMatches = async () => {
    try {
      const dataMatches = await axios.get<IMatch[]>(`/api/matches/current`);
      let a = dataMatches.data.slice();
      a.map(async (match) => {
        match.playerNames = [];
        match.playerNames[0] = await getPlayerName(match.player_ids[0]);
        match.playerNames[1] = await getPlayerName(match.player_ids[1]);
      });
      if (JSON.stringify(a) !== JSON.stringify(matchList)) {
        setMatchList(a);
      }
    } catch (error) {
      console.log(error);
      // setMatchList([]);
    }
  };

  const buttonClassname =
    "flex rounded-lg py-2 px-4 " +
    " bg-secondary hover:bg-secondary-dark" +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto";
  const textButtonClassname = "text-2xl font-bold text-gray-900";


  const displayHomeGamePannel = () => {
    return (
      <div className='grid justify-center'>
        <div className="inline-block max-w-sm px-2 py-8 mt-16 mb-8 border-2 border-gray-300 rounded-lg bg-neutral md:px-12 md:max-w-lg">
          <div className="flex justify-center mb-8 text-2xl font-bold md:text-3xl ">
            Do you want to play?
          </div>
          <div className="flex w-auto space-x-8 rounded-md lg:space-x-24">
            <NavLink
              className={buttonClassname}
              to="/game/matchmaking"
            >
              <span className={textButtonClassname}>Fast Game</span>
            </NavLink>
            <NavLink
              className={buttonClassname}
              to="/game/create"
            >
              <span className={textButtonClassname}>Create Game</span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  };

  const displayMatchesList = () => {
    if (matchList.length) {
      return (
        <ul>
          {matchList.map((match) => {
            return (
              <li key={match.id}>
                <CurrentMatchItem
                  playerA={match.playerNames[0]}
                  playerB={match.playerNames[1]}
                  scoreA={match.scores[0]}
                  scoreB={match.scores[1]}
                  id={match.id}
                />
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <div className="font-semibold">There is no live game for now.</div>
      );
    }
  };

  const displayCurrentGames = () => {
    return (
      <section className="h-auto px-8 py-4 my-8 border-2 border-gray-300 rounded-sm bg-neutral">
        <div>
          <h1 className="text-3xl font-bold text-center">Live games</h1>
          <section className="flex justify-center pt-4">
            {displayMatchesList()}
          </section>
        </div>
      </section>
    );
  };

  useEffect(() => {
    getAllCurrentMatches();
  })

  return (
    <div className="h-screen grid justify-center overflow-y-scroll">
      <div className='mb-8'>

      {displayHomeGamePannel()}
      {displayCurrentGames()}
      </div>
    </div>
  );
}

export default GameHome;
