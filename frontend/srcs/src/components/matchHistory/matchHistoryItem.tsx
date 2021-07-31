import { IMatch } from '../../models/match/IMatch';

type MatchProps = {
    match: IMatch
}

function MatchHistoryItem(props: MatchProps) {
    return (
        <div className="grid justify-center w-auto grid-cols-6 py-2 my-2 whitespace-pre bg-gray-200 border-2 border-gray-300">
            <div className="grid flex-1 col-span-1 text-center items-center">
                {props.match.scores[0] > props.match.scores[1] ? <i className="text-green-600 fill-current fas fa-check"></i> : <i className="text-red-600 fill-current fas fa-times"></i>}
            </div>
            <div className="grid flex-1 col-span-2 text-center ">
                <span className="w-24 font-bold md:w-40 truncate">{props.match.playerNames[0]}</span>
                vs
                <span className="w-24 font-bold md:w-40 truncate">{props.match.playerNames[1]}</span>
            </div>
            <div className="grid justify-center flex-1 col-span-1 text-center">
                <span className="font-bold">{props.match.scores[0]}</span>
                -
                <span className="font-bold ">{props.match.scores[1]}</span>
            </div>
            <div className="flex-1 col-span-2 text-center grid items-center">
                <span className="italic"> {props.match.endAt.toString().substring(0, 10)}    </span>
            </div>
        </div>
    );
}

export default MatchHistoryItem;