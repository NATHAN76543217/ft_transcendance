import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import CurrentMatches from "../../../components/matchHistory/currentMatches";
import { IMatch } from "../../../models/match/IMatch";

function GameHome() {
  const [matchList, setMatchList] = useState<{ list: IMatch[] }>({ list: [] });
  const [matchesLoaded, setMatchesLoaded] = useState<boolean>(false);

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

  

  useEffect(() => {
    const getAllCurrentMatches = async () => {
      try {
        const dataMatches = await axios.get<IMatch[]>(`/api/matches/current`);
        // console.log('dataMatches', dataMatches)
        if (!dataMatches.data.length) {
          setMatchList({ list: [] });
          return;
        }
        let a: IMatch[] = [];
        dataMatches.data.map(async (match, index) => {
          let playerNames: string[] = [];
          const nameA = await getPlayerName(match.player_ids[0]);
          const nameB = await getPlayerName(match.player_ids[1]);
          playerNames = [nameA, nameB];
          a[index] = {
            id: match.id,
            player_ids: match.player_ids,
            scores: match.scores,
            startedAt: match.startedAt,
            endAt: match.endAt,
            playerNames: playerNames,
          };
          if (!matchesLoaded) {
            setMatchList({ list: a });
          }
        });
        if (!matchesLoaded) {
          setMatchesLoaded(true);
          setMatchList({ list: a });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (!matchesLoaded) {
      getAllCurrentMatches();
    }
  }, [matchesLoaded])

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


  const displayCurrentGames = () => {
    return (
      <section className="h-auto px-8 py-4 my-8 border-2 border-gray-300 rounded-sm bg-neutral">
        <div>
          <h1 className="text-3xl font-bold text-center">Live games</h1>
          <section className="flex justify-center pt-4">
            <CurrentMatches
              matchList={matchList.list}
              matchesLoaded={matchesLoaded}
            />
          </section>
        </div>
      </section>
    );
  };


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
