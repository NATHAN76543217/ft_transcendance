import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import CurrentMatchItem from "../../../components/matchHistory/currentMatchItem";
import { IMatch } from "../../../models/match/IMatch";

function GameHome() {
  const [matchList, setMatchList] = useState<IMatch[]>([]);

  const getPlayerName = async (user_id: string) => {
    try {
      const dataUser = await axios.get(`/api/users/${user_id}`);
      console.log("dataUser", dataUser);
      return dataUser.data.name;
    } catch (error) {
      console.log(error);
      return "Unknown player";
    }
  };

  const getAllCurrentMatches = async () => {
    try {
      const dataMatches = await axios.get<IMatch[]>(`/api/matches/current`);
      console.log(`current matches`, dataMatches);
      let a = dataMatches.data.slice();
      a.map(async (match) => {
        match.playerNameA = await getPlayerName(match.idPlayerOne);
        match.playerNameB = await getPlayerName(match.idPlayerTwo);
      });
      if (JSON.stringify(a) !== JSON.stringify(matchList)) {
        setMatchList(a);
      }
    } catch (error) {
      console.log(error);
      // setMatchList([]);
    }
  };

  const fastGame = () => {
    console.log("Fast game");
  };

  const createGame = () => {
    console.log("Create game");
  };

  const buttonClassname =
    "flex rounded-lg py-2 px-4 " +
    " bg-secondary hover:bg-secondary-dark" +
    " focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap w-auto";
  const textButtonClassname = "text-2xl font-bold text-gray-900";

  // const displayCurrentGames = () => {
  //   const currentGames = await axios.get('/api/matches/current');
  //   currentGames.data.map((match) => {

  //   })
  // }

  const displayHomeGamePannel = () => {
    return (
      <div className="inline-block max-w-sm px-2 py-8 mt-24 border-2 border-gray-300 rounded-lg bg-neutral md:px-12 md:max-w-lg">
        <div className="flex justify-center mb-8 text-2xl font-bold md:text-3xl ">
          Do you want to play?
        </div>
        <div className="flex w-auto space-x-8 rounded-md lg:space-x-24">
          <NavLink
            className={buttonClassname}
            to="game/matchmaking"
            onClick={() => fastGame()}
          >
            <span className={textButtonClassname}>Fast Game</span>
          </NavLink>
          <NavLink
            className={buttonClassname}
            to="game/create"
            onClick={() => createGame()}
          >
            <span className={textButtonClassname}>Create Game</span>
          </NavLink>
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
              <li key={match.idMatch}>
                <CurrentMatchItem
                  playerA={match.playerNameA}
                  playerB={match.playerNameB}
                  scoreA={match.scorePlayerOne}
                  scoreB={match.scorePlayerTwo}
                  link={match.idMatch}
                />
              </li>
            );
          })}
          {/* <li key={1}>
                    <CurrentMatchItem
                      playerA={'123456789123456'}
                      playerB={'jean'}
                      scoreA={10}
                      scoreB={5}
                      link={'link'}
                    />
                  </li>
                  <li key={2}>
                    <CurrentMatchItem
                      playerA={'bob'}
                      playerB={'jean'}
                      scoreA={10}
                      scoreB={5}
                      link={'link'}
                    />
                  </li> */}
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
      <section className="h-auto px-8 py-8 mt-8 border-2 border-gray-300 rounded-sm bg-neutral">
        <div>
          <h1 className="text-3xl font-bold text-center">Live games</h1>
          <section className="flex justify-center pt-4">
            {displayMatchesList()}
          </section>
        </div>
      </section>
    );
  };

  getAllCurrentMatches();

  return (
    <div className="grid justify-center">
      {displayHomeGamePannel()}
      {displayCurrentGames()}
    </div>
  );
}

export default GameHome;
