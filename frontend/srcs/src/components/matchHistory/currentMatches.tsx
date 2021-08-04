import { IMatch } from "../../models/match/IMatch";
import CurrentMatchItem from "./currentMatchItem";
import MatchHistoryItem from "./matchHistoryItem";

type currentMatchesProps = {
  matchList: IMatch[],
  matchesLoaded: boolean
}

function CurrentMatches(props: currentMatchesProps) {

  const displayCurrentMatches = () => {
    if (props.matchList.length) {
      return (
        <ul>
          {props.matchList.map((match) => {
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
  }


  return (
      displayCurrentMatches()
  );
}

export default CurrentMatches;
