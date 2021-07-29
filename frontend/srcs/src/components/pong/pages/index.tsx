import {useReducer} from "react"
import { Route } from "react-router";
import { defaultGameState, defaultRuleSet, GameContext, GameState, RuleSet } from "../context"
import { CreatePong } from "./create";

export enum Action {

}

function stateReducer(state : GameState, action : { type: Action} ) {
    switch(action.type)
    {
        default:
            return state;
    }
}

function ruleSetReducer(state : RuleSet, action : { type: Action} ) {
    switch(action.type)
    {
        default:
            return state;
    }
}

function playerIdsReducer(state : number [], action : { type: Action} ) {
    switch(action.type)
    {
        default:
            return state;
    }
}

export function Pong() {

    const [state, stateDispatch] = useReducer(stateReducer, defaultGameState);
    const [ruleSet, rulesSetDispatch] = useReducer(ruleSetReducer, defaultRuleSet);
    const [playerIds, playerIdsDispatch] = useReducer(playerIdsReducer, []);


    return (
        <GameContext.Provider value={{state, stateDispatch, ruleSet, rulesSetDispatch, playerIds, playerIdsDispatch}}>
            <Route path="/game/create">
                <CreatePong />
            </Route>
        </GameContext.Provider>
    );
}
