import { IMatch } from '../../models/match/IMatch';

type MatchProps = {
    match: IMatch
}


function MatchHistoryItem(props: MatchProps) {

    const displayWinIcon = () => {
        let className = "text-blue-500 fill-current fas fa-equals";
        if (props.match.scores[0] > props.match.scores[1]) {
            className = "text-green-600 fill-current fas fa-check"
        } else if (props.match.scores[0] < props.match.scores[1]) {
            className = "text-red-600 fill-current fas fa-times"
        }
        return (
            <div className="grid flex-1 col-span-1 text-center items-center">
                <i className={className}></i>
            </div>
        )
    }

    const displayPlayerNames = () => {
        return (
            <div className="grid flex-1 col-span-2 text-center justify-center">
                <span className="w-24 font-bold md:w-40 truncate">{props.match.playerNames[0]}</span>
                vs
                <span className="w-24 font-bold md:w-40 truncate">{props.match.playerNames[1]}</span>
            </div>
        )
    }

    const displayScores = () => {
        if (props.match.scores[0] === -1 || props.match.scores[1] === -1) {
            return (
                <div className="grid justify-center flex-1 col-span-1 text-center ">
                    <div className="transform -rotate-45 grid items-center">
                        <span className=" font-bold h-6e">Forfeit</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="grid justify-center flex-1 col-span-1 text-center">
                    <span className="font-bold">{props.match.scores[0]}</span>
                    -
                    <span className="font-bold ">{props.match.scores[1]}</span>
                </div>
            )
        }
    }

    const displayDate = () => {
        return (
            <div className="flex-1 col-span-2 text-center grid items-center">
                <span className="italic"> {props.match.endAt ? props.match.endAt.toString().substring(0, 10) : ''}    </span>
            </div>
        )
    }

    return (
        <div className="grid justify-center w-auto grid-cols-6 py-2 my-2 whitespace-pre bg-gray-200 border-2 border-gray-300">
            {displayWinIcon()}
            {displayPlayerNames()}
            {displayScores()}
            {displayDate()}
        </div>
    );
}

export default MatchHistoryItem;