import React from "react"
import ContiniousSlider from "./continuousSlider"

interface ICustomization
{
    gameConfig : Array<ContiniousSlider>;
}

export default class Customization extends React.Component
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
            </div>
        );
    }
}