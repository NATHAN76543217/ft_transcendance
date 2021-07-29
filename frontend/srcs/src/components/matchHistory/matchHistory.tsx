import MatchHistoryItem from "./matchHistoryItem";

function MatchHistory() {
  return (
    <section className="w-auto pt-4 pb-4 mx-4 my-4 bg-gray-100 h-52">
      <div>
        <h1 className="text-3xl font-bold text-center">Match History</h1>
        <section className="relative flex justify-center pt-4">
          <ul className="">
            <MatchHistoryItem
              playerA="Login"
              playerB="playerB"
              scoreA={11}
              scoreB={8}
              date="15/06/2021"
            />
            <MatchHistoryItem
              playerA="Login"
              playerB="pC"
              scoreA={5}
              scoreB={11}
              date="02/06/2021"
            />
            <MatchHistoryItem
              playerA="Login"
              playerB="Jean-Pierre"
              scoreA={11}
              scoreB={10}
              date="28/04/2021"
            />
          </ul>
        </section>
      </div>
    </section>
  );
}

export default MatchHistory;
