import React from "react"
import {
    GameMode
} from "../../../../../../pong/engine/polimorphiclib";
import ContiniousSlider from "./continuousSlider"

interface ICustomization
{
    gameConfig : Array<ContiniousSlider>;
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

export class Customization extends React.Component
{
    constructor(
        props : Readonly<{}>,
        public data : ICustomization,
        public divClassName : string,
        public sliderDivClassName : string
    )
    { super (props); }

    render()
    {
        // Modulo is a security from never overflow in human error case
        return (
            <div className={this.divClassName}>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[0 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[1 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[2 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[3 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[4 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[5 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[6 % this.data.gameConfig.length]}
                </div>
                <div className={this.sliderDivClassName}>
                    {this.data.gameConfig[7 % this.data.gameConfig.length]}
                </div>
                {
                    this.data.gameMode == GameMode.SINGLE_PLAYER
                    ?
                    <div className="">
                        <div className={this.sliderDivClassName}>
                            {this.data.gameConfig[8 % this.data.gameConfig.length]}
                        </div>
                        <div className={this.sliderDivClassName}>
                            {this.data.gameConfig[9 % this.data.gameConfig.length]}
                        </div>
                        <div className={this.sliderDivClassName}>
                            {this.data.gameConfig[9 % this.data.gameConfig.length]}
                        </div>
                        <div className={this.sliderDivClassName}>
                            {this.data.gameConfig[10 % this.data.gameConfig.length]}
                        </div>
                    </div>
                    : 0
                }
            </div>
        );
    }
}