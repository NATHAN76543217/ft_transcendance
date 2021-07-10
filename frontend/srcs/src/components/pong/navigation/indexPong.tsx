import React from "react"

import SelectGameStyle from "./pages/gameType"
import GameCustom from "./pages/gameCustom"
import GameFast from "./pages/gameFast"
import Invited from "./pages/invited"
import Pong from "./pages/pong"
import PongGenerator from "../../../../../../pong/engine/engine"
import  ClassicPong from "../../../../../../pong/specilizations/classicpong/classicpong.engine"
import {
    Socket,
    SocketIoConfig
} from "ngx-socket-io"


enum Pages {
    SELECT_GAME_STYLE,
    FAST_GAME,
    CUSTOM_GAME,
    INVITED,
    PONG,
}

export default class IndexPong extends React.Component
{
    public currentPage : Pages = Pages.SELECT_GAME_STYLE;
    public index : number = 0;

    public socket : Socket = new Socket({
        url: 'http://localhost',
        options: {}
    } as SocketIoConfig);

    public pongFinals : Array<PongGenerator> = [
        new ClassicPong(
            this.playerId,  // idRoom == idPlayerOne
            this.playerId,
            String(),
            this.socket
        ),
        // TO DO: Vertical pong specilisation
    ];

    constructor(
        props : Readonly<{}>,
        public playerId : string,
        public isInvited : boolean,
    )
    {
        super(props);
        
        if (isInvited == true)
            this.currentPage = Pages.INVITED;
        
        this.goToFastGame = this.goToFastGame.bind(this);
        this.goToCustomGame = this.goToCustomGame.bind(this);
        this.goToSelection = this.goToSelection.bind(this);
        this.goToPongGame = this.goToPongGame.bind(this);

        // TO DO: Insert invited
    }

    public goToFastGame()
    { this.currentPage = Pages.FAST_GAME; }

    public goToCustomGame()
    { this.currentPage = Pages.CUSTOM_GAME; }

    public goToSelection()
    { this.currentPage = Pages.SELECT_GAME_STYLE; }

    public goToPongGame()
    { this.currentPage = Pages.PONG; }

    public render()
    {
        // TO DO: Invited playerTwo already has a socket !
        return (
            <div className="">
            {
                this.currentPage == Pages.SELECT_GAME_STYLE
                ? new SelectGameStyle(
                    this.props,
                    this.goToFastGame,
                    this.goToCustomGame
                )
                : this.currentPage == Pages.FAST_GAME
                ? new GameFast(
                    this.props,
                    this.goToSelection,
                    this.goToPongGame
                )
                : this.currentPage == Pages.CUSTOM_GAME
                ? new GameCustom(
                    this.props,
                    this.playerId,
                    this.socket,
                    this,
                    this.goToSelection,
                    this.goToPongGame
                )
                : this.currentPage == Pages.PONG
                ? new Pong(
                    this.props,
                    this.socket,
                    this.pongFinals[this.index]
                )
                : 0
            }
            </div>
        );
    }
}