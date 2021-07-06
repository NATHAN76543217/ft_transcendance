
// 1 st layer: 2 button: "Fast Game" & "Custom Game"
// On click calls other components

import React from 'react';


export default class SelectGameStyle extends React.Component
{
    constructor(
        props : Readonly<{}>
    )
    {
        super(props);

        this.loadFastGame = this.loadFastGame.bind(this);
        this.loadCustomGame = this.loadCustomGame.bind(this);
    }

    public loadFastGame()
    {
        // Shoukd call another react component
        // Or should just set a bool and switch react component
    }

    public loadCustomGame()
    {
        // Should call another react component
        // Or should just set a bool and switch react component
    }

    public render()
    {
        return(
            <div className="h-64 flex flex-wrap content-center md:content-around">
                <div className="">
                    <button className="bg-green-400 bg-opacity-60" onClick={this.loadFastGame}>
                        Fast Game
                    </button>
                </div>
                <div className="">
                    <button className="bg-green-400 bg-opacity-60" onClick={this.loadCustomGame}>
                        Custom Game
                    </button>
                </div>
            </div>
        );
    }
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