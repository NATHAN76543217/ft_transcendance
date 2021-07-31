import React from 'react';

type MatchProps = {
    playerNames : string[];
    scores : number[];
    date: string   // should be date
}

function MatchHistoryItem(match: MatchProps) {
    return (
        <div className="grid justify-center w-auto grid-cols-7 whitespace-pre ">
            <div className="flex-1 col-span-1 text-center">
                {match.scores[0] > match.scores[1] ? <i className="text-green-600 fill-current fas fa-check"></i> : <i className="text-red-600 fill-current fas fa-times"></i>}
            </div>
            <div className="flex-1 col-span-3 text-center truncate">
                <span className="font-bold">{match.playerNames[0]} </span>
            vs
            <span className="font-bold"> {match.playerNames[1]}    </span>
            </div>
            <div className="flex-1 col-span-1 text-center">
                <span className="font-bold"> {match.scores[0]}</span>
            -
            <span className="font-bold"> {match.scores[1]}    </span>
            </div>
            <div className="flex-1 col-span-2 text-center">
                <span className="italic"> {match.date}    </span>
            </div>
        </div>
    );
}

export default MatchHistoryItem;