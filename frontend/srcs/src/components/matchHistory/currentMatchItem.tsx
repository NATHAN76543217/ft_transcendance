import React from 'react';
import { NavLink } from 'react-router-dom';

type CurrentMatchProps = {
    playerA: string,
    playerB: string,
    scoreA: number,
    scoreB: number,
    id: number,
}

function CurrentMatchItem(match: CurrentMatchProps) {
    console.log('CurrentMatchItem', match)
    return (
        <div className="grid justify-center grid-cols-3 p-4 my-2 whitespace-pre bg-gray-200 border-2 border-gray-300">
            <div className="grid flex-1 col-span-1 text-center ">
                <span className="w-24 font-bold md:w-40">{match.playerA}</span>
            vs
            <span className="font-bold">{match.playerB}</span>
            </div>
            <div className="grid justify-center flex-1 col-span-1 text-center">
                <span className="font-bold">{match.scoreA}</span>
            -
            <span className="font-bold ">{match.scoreB}</span>
            </div>
            <div className='grid items-center'>

                <NavLink
                    className="flex-1 col-span-2 text-center"
                    to={`game/${match.id}`}
                >
                    <span className='italic break-words whitespace-pre-line md:whitespace-nowrap hover:underline'>Watch this
                    game</span>
                </NavLink>
            </div>
        </div>
    );
}

export default CurrentMatchItem;