import axios from "axios";
import { useState } from "react";
import { IMatch } from "../../models/match/IMatch";
import MatchHistoryItem from "./matchHistoryItem";

type matchHistoryProps = {
  id: number;
  name: string;
}



function MatchHistory(props: matchHistoryProps) {

  const [matchList, setMatchList] = useState<IMatch[]>([]);


  const getPlayerName = async (user_id: number) => {
    try {
      const dataUser = await axios.get(`/api/users/${user_id}`);
      console.log('dataUser', dataUser)
      return dataUser.data.name;
    } catch (error) {
      console.log(error);
      return 'Unknown player'
    }
  }

  const getAllMatches = async () => {
    try {
      const dataMatches = await axios.get<IMatch[]>(`/api/matches/user/${props.id}`)
      console.log(`matches for user ${props.id}`, dataMatches)
      let a = dataMatches.data.slice();
      a.map(async (match) => {
        const inf = props.id === Number(match.player_ids[0]);
        if (inf) {
          match.playerNames[0] = await getPlayerName(match.player_ids[1]);
        } else {
          match.playerNames[0] = await getPlayerName(match.player_ids[0]);
          const scoreTemp = match.scores[0];
          match.scores[0] = match.scores[1];
          match.scores[1] = scoreTemp;
        }
      })
      if (JSON.stringify(a) !== JSON.stringify(matchList)) {
        setMatchList(a)
      }
    } catch (error) {
      console.log(error)
      // setMatchList([]);
    }
  }

  const displayMatchHistory = () => {
    if (matchList.length) {
      return (
        <ul className="">
            {matchList.map((match) => {
              return (
                <li key={match.id}>
                  <MatchHistoryItem
                    playerNames={[props.name,match.playerNames[0]]}
                    scores={[match.scores[0],match.scores[1]]}
                    date={match.endAt.toString()}
                  />
                </li>
              )
            })}
          </ul>
      )
    } else {
      return (
        <div className='font-semibold'>
          {props.name} hasn't played a game yet
        </div>
      )
    }
  }

  getAllMatches();

  return (
    <section className="h-auto px-8 py-8 mt-8 border-2 border-gray-300 rounded-sm bg-neutral">
      <div>
        <h1 className="text-3xl font-bold text-center">Match History</h1>
        <section className="flex justify-center pt-4">
          {displayMatchHistory()}
          {/* <ul className="">
            {matchList.map((match) => {
              return (
                <li key={match.idMatch}>
                  <MatchHistoryItem
                    playerA={props.name}
                    playerB={match.playerNameA}
                    scoreA={match.scorePlayerOne}
                    scoreB={match.scorePlayerTwo}
                    date={match.endTime.toString()}
                  />
                </li>
              )
            })}
          </ul> */}
        </section>
      </div>
    </section>
  );
}

export default MatchHistory;
