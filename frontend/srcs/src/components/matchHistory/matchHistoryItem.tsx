import React from 'react';

type MatchProps = {
    playerA: string,
    playerB: string,
    scoreA: number,
    scoreB: number,
    date: string   // should be date
}

function MatchHistoryItem(match: MatchProps) {
    return (
        <div className="grid justify-center w-auto grid-cols-7 whitespace-pre ">
            <div className="relative flex-1 col-span-1 text-center">
                {match.scoreA > match.scoreB ? <i className="text-green-600 fill-current fas fa-check"></i> : <i className="text-red-600 fill-current fas fa-times"></i>}
            </div>
            <div className="relative flex-1 col-span-3 text-center truncate">
                <span className="font-bold">{match.playerA} </span>
            vs
            <span className="font-bold"> {match.playerB}    </span>
            </div>
            <div className="relative flex-1 col-span-1 text-center">
                <span className="font-bold"> {match.scoreA}</span>
            -
            <span className="font-bold"> {match.scoreB}    </span>
            </div>
            <div className="relative flex-1 col-span-2 text-center">
                <span className="italic"> {match.date}    </span>
            </div>
        </div>
    );
}

export default MatchHistoryItem;