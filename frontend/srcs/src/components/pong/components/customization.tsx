import React from "react"
import {
    GameMode
} from "../../../../../../pong/engine/polimorphiclib";
import ContiniousSlider from "./continuousSlider"
import {
    CustomizationContext
} from "../navigation/pages/gameCustom"
import {
    InvitedCustomizationContext
} from "../navigation/pages/invited"

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
    divClassName : string;
    sliderDivClassName : string;
}

type Setter = React.Dispatch<React.SetStateAction<number>>;

export function Customization({
    divClassName,
    sliderDivClassName
} : ICustomizationProps)
{
    const context = React.useContext(CustomizationContext);

    const setUpSlider = (key : CustomValue, disabled? : true) : JSX.Element => {
        return (
            <ContiniousSlider
                name={String(key)}
                stateShared={{
                    value: Number(context.sliders.get(key)?.[0]),
                    setValue: context.sliders.get(key)?.[1] as Setter
                }}
                disabled={disabled}
            />
        );
    };

    return (
        <div className={divClassName}>
            <div className={sliderDivClassName}>
               {setUpSlider(CustomValue.BALL_SPEED)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.BALL_COLOR)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.COURT_COLOR)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.NET_COLOR)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_WIDTH)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_HEIGHT)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_COLOR)}
            </div>
            <CustomizationContext.Consumer>
            {
                customization => 
                <div className={sliderDivClassName}>
                    {setUpSlider(CustomValue.PLAYER_TWO_WIDTH,
                    customization.gameMode == GameMode.MULTI_PLAYER ? true : undefined)}
                </div>
            }
            </CustomizationContext.Consumer>
            <CustomizationContext.Consumer>
            {
                customization =>
                <div className={sliderDivClassName}>
                    {setUpSlider(CustomValue.PLAYER_TWO_HEIGHT,
                    customization.gameMode == GameMode.MULTI_PLAYER ? true : undefined)}
                </div>
            }
            </CustomizationContext.Consumer>
            <CustomizationContext.Consumer>
            {
                customization =>
                <div className={sliderDivClassName}>
                    {setUpSlider(CustomValue.PLAYER_TWO_COLOR,
                    customization.gameMode == GameMode.MULTI_PLAYER ? true : undefined)}
                </div>
            }
            </CustomizationContext.Consumer>
            <CustomizationContext.Consumer>
            {
                customization =>
                <div className={sliderDivClassName}>
                    {setUpSlider(CustomValue.BOT_LEVEL,
                    customization.gameMode == GameMode.MULTI_PLAYER ? true : undefined)}
                </div>
            }
            </CustomizationContext.Consumer>
        </div>
    );
}

export function InvitedCustomization({
    divClassName,
    sliderDivClassName
} : ICustomizationProps)
{
    const context = React.useContext(InvitedCustomizationContext);

    const setUpSlider = (key : CustomValue, disabled? : true) : JSX.Element => {
        return (
            <ContiniousSlider
                name={String(key)}
                stateShared={{
                    value: Number(context.sliders.get(key)?.[0]),
                    setValue: context.sliders.get(key)?.[1] as Setter
                }}
                disabled={disabled}
            />
        );
    };

    return (
        <div className={divClassName}>
            <div className={sliderDivClassName}>
               {setUpSlider(CustomValue.BALL_SPEED, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.BALL_COLOR, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.COURT_COLOR, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.NET_COLOR, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_WIDTH, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_HEIGHT, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_ONE_COLOR, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_TWO_WIDTH, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_TWO_HEIGHT, true)}
            </div>
            <div className={sliderDivClassName}>
                {setUpSlider(CustomValue.PLAYER_TWO_COLOR)}
            </div>
        </div>
    );
}
