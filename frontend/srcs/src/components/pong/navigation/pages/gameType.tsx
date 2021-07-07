
// 1 st layer: 2 button: "Fast Game" & "Custom Game"
// On click calls other components

import React from 'react';

import Button from "../../components/button"


export default class SelectGameStyle extends React.Component
{
    constructor(
        props : Readonly<{}>,
        public loadFastGame : React.MouseEventHandler<HTMLButtonElement>,
        public loadCustomGame : React.MouseEventHandler<HTMLButtonElement>
    )
    {
        super(props);

        this.loadFastGame = this.loadFastGame.bind(this);
        this.loadCustomGame = this.loadCustomGame.bind(this);
    }

    public render()
    {
        return (
            <div className="h-64 flex flex-wrap content-center md:content-around">
                {
                    new Button(
                        this.props,
                        "Fast Game",
                        "",
                        "bg-green-400 bg-opacity-60",
                        this.loadFastGame
                    )
                }
                {
                    new Button(
                        this.props,
                        "Custom Game",
                        "",
                        "bg-green-400 bg-opacity-60",
                        this.loadCustomGame
                    )
                }
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