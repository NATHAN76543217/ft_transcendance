import { IMatch } from "../../models/match/IMatch";
import MatchHistoryItem from "./matchHistoryItem";

type matchHistoryProps = {
  name: string;
  matchList: IMatch[]
}

function MatchHistory(props: matchHistoryProps) {

  const displayMatchHistory = () => {
    if (props.matchList) {
      return (
        <ul className="">
          {props.matchList.map((match) => {
            return (
              <li key={match.id}>
                <MatchHistoryItem
                  match={match}
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


  return (
    <section className="h-auto px-8 py-4 mt-8 border-2 border-gray-300 rounded-sm bg-neutral">
      <div>
        <h1 className="text-3xl font-bold text-center">Match History</h1>
        <section className="flex justify-center pt-4">
          {displayMatchHistory()}
        </section>
      </div>
    </section>
  );
}

export default MatchHistory;
