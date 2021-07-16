import React from "react"

import ButtonPong from "../../components/button"
import {
    PongContext
} from "../indexPong"

export default function SelectGameStyle()
{
    const context = React.useContext(PongContext);

    return (
        <>
            <div className="h-64 flex flex-wrap content-center md:content-around">
                <ButtonPong
                    content="Fast Game"
                    divClassName=""
                    buttonClassName="bg-green-400 bg-opacity-60"
                    onClickHandler={() => context.goToFastGame()}
                />
                <ButtonPong
                    content="Custom Game"
                    divClassName=""
                    buttonClassName="bg-green-400 bg-opacity-60"
                    onClickHandler={() => context.goToCustomGame()}
                />
            </div>
        </>
    );
}

// How to switch between react components:
// https://stackoverflow.com/questions/34078033/switching-between-components-in-react-js

/* Tailwind play:

<div class="h-64 flex flex-wrap content-center md:content-around">
                <div className="">
                    <button class="bg-green-400 bg-opacity-60" onClick={this.loadFastGame}>
                        Fast Game
                    </button>
                </div>
                <div className="">
                    <button class="bg-green-400 bg-opacity-60" onClick={this.loadCustomGame}>
                        Custom Game
                    </button>
                </div>
            </div>
*/