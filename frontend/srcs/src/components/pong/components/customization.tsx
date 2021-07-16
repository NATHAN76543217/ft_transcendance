import React from "react"
import {
    GameMode
} from "../../../../../../pong/engine/polimorphiclib";
import ContiniousSlider from "./continuousSlider"

interface ICustomization
{
    gameConfig : Array<JSX.Element>;
    gameMode : GameMode
}

export const BALL_SPEED : string = "Ball speed";
export const BALL_COLOR : string = "Ball color";
export const COURT_COLOR : string = "Court color";
export const NET_COLOR : string = "Net color";
export const PLAYER_ONE_WIDTH : string = "Player one width";
export const PLAYER_ONE_HEIGHT : string = "Player one height";
export const PLAYER_ONE_COLOR : string = "Player one color";
export const PLAYER_TWO_WIDTH : string = "Player two width";
export const PLAYER_TWO_HEIGHT : string = "Player two height";
export const PLAYER_TWO_COLOR : string = "Player two color";
export const BOT_LEVEL : string = "Bot level";

// TO DO: Use enum CustomValue instead of "defines"

export enum CustomValue
{
    BALL_SPEED = "Ball speed",
    BALL_COLOR = "Ball color",
    COURT_COLOR = "Court color",
    NET_COLOR = "Net color",
    PLAYER_ONE_WIDTH = "Player one width",
    PLAYER_ONE_HEIGHT = "Player one height",
    PLAYER_ONE_COLOR = "Player one color",
    PLAYER_TWO_WIDTH = "Player two width",
    PLAYER_TWO_HEIGHT = "Player two height",
    PLAYER_TWO_COLOR = "Player two color",
    BOT_LEVEL = "Bot level"
}

type ICustomizationProps = {
    data : ICustomization;
    divClassName : string;
    sliderDivClassName : string;
}

// TO DO: Data must be context

export default function Customization({
    data,
    divClassName,
    sliderDivClassName
} : ICustomizationProps)
{
    return (
        <div className={divClassName}>
            <div className={sliderDivClassName}>
                {data.gameConfig[0 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[1 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[2 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[3 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[4 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[5 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[6 % data.gameConfig.length]}
            </div>
            <div className={sliderDivClassName}>
                {data.gameConfig[7 % data.gameConfig.length]}
            </div>
            {
                data.gameMode == GameMode.SINGLE_PLAYER
                ?
                <div className="">
                    <div className={sliderDivClassName}>
                        {data.gameConfig[8 % data.gameConfig.length]}
                    </div>
                    <div className={sliderDivClassName}>
                        {data.gameConfig[9 % data.gameConfig.length]}
                    </div>
                    <div className={sliderDivClassName}>
                        {data.gameConfig[9 % data.gameConfig.length]}
                    </div>
                    <div className={sliderDivClassName}>
                        {data.gameConfig[10 % data.gameConfig.length]}
                    </div>
                </div>
                : 0
            }
        </div>
    );
}
