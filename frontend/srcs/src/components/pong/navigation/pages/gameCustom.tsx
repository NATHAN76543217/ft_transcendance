import React from 'react'

import {
    GameMode
} from "../../../../../../../pong/engine/polimorphiclib"
import PongGenerator from "../../../../../../../pong/engine/engine"
import {
    IRoomDto
} from "../../../../../../../pong/server/socketserver"
import {
    RangeSlider,
} from "../../../../../../../pong/settings/dto/rangeslider"
import ButtonPong from '../../components/button'
import PongStyleSelector from '../../components/ponsStyleSelector'
import {
    Customization,
    CustomValue
} from "../../components/customization"
import LibNames from "../../../../../../../pong/engine/lib.names"
import {
    ICustomGame
} from "../.../../../../../../../../pong/server/socketserver"
import {
    AStyle
} from "../../../../../../../pong/render/style"
import {
    PongContext,
} from "../indexPong"
import {
    Mesages
} from "../../../../../../../pong/server/socketserver"

type IPongStyleSelectorContext = {
    pongSpetializations : Readonly<Array<[string, PongGenerator]>>;
    pongIndex : Readonly<number>;
    setPongIndex : React.Dispatch<React.SetStateAction<number>>;
}

export const PongStyleSelectorContext = React.createContext<IPongStyleSelectorContext>({
    pongSpetializations: Array(),
    pongIndex: Number(),
    setPongIndex: () => {}
});

type ICustomizationContext = {
    sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]>;
    gameMode : GameMode
}

export const CustomizationContext = React.createContext<ICustomizationContext>({
    sliders : new Map(),
    gameMode :  GameMode.MULTI_PLAYER
});

// TO DO: Finish a game and call server's endGame

export default function GameCustom()
{
    const context = React.useContext(PongContext);

    // Handle SINGLEPLAYER, MULTIPLAYER mode value
    const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.MULTI_PLAYER);

    // Create a room in the server
    context.socket.emit(Mesages.CREATE_ROOM, {
        isFilled: false,
        idRoom: context.playerId,
        idPlayerOne: context.playerId,
        idPlayerTwo: String(),
        config: { },
        lib: { },
        libName: String(),
        mode: gameMode,
        customization: { },
        info: { },
        flags: Number(0)
    } as IRoomDto);

    context.setGameId(context.playerId);

    // Handle "Ready" value
    const [isReady, setIsReady] = React.useState<boolean>(false);

    // Init sliders data using the preloaded config in the context (context.pongSpetializations[context.pongIndex])
    const sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]> = new Map([
        [CustomValue.BALL_SPEED, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed,
            context.pongSpetializations[context.pongIndex][1].gameStatus.ball.speed))],
        [CustomValue.BALL_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.colorLimit,
            context.pongSpetializations[context.pongIndex][1].gameStatus.ball.style.toNumber()))],
        [CustomValue.COURT_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.colorLimit,
            context.pongSpetializations[context.pongIndex][1].gameStatus.court.style.toNumber()))],
        [CustomValue.NET_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.colorLimit,
            context.pongSpetializations[context.pongIndex][1].gameStatus.net.style.toNumber()))],
        [CustomValue.PLAYER_ONE_WIDTH, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.playerOneWidth,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerOne.width))],
        [CustomValue.PLAYER_ONE_HEIGHT, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.playerOneHeight,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerOne.height))],
        [CustomValue.PLAYER_ONE_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.colorLimit,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerOne.style.toNumber()))],
        [CustomValue.PLAYER_TWO_WIDTH, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.playerTwoHeight,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.width))],
        [CustomValue.PLAYER_TWO_HEIGHT, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.playerTwoHeight,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.height))],
        [CustomValue.PLAYER_TWO_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.colorLimit,
            context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.style.toNumber()))],
        [CustomValue.BOT_LEVEL, React.useState(RangeSlider.toRange({ min: 0.1, max: 0.7 }, 0.1 ))], // TO DO: Can be better performed ?
    ]);

    // Handle shared customization
    const [sliderShared, setSliderShared] = React.useState<ICustomGame>({
        ballSpeed: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.BALL_SPEED)?.[0]))),
        ballColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.BALL_COLOR)?.[0])))),
        courtColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.COURT_COLOR)?.[0])))),
        netColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.NET_COLOR)?.[0])))),
        playerOneWidth: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_WIDTH)?.[0]))),
        playerOneHeight: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_HEIGHT)?.[0]))),
        playerOneColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_COLOR)?.[0])))),
        playerTwoWidth: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_TWO_WIDTH)?.[0]))),
        playerTwoHeight: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_TWO_HEIGHT)?.[0]))),
        playerTwoColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
            context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_TWO_COLOR)?.[0]))))
        // TO DO: Add bot level here, no ?
    });

    // TO DO: This is not real time sync with invited (need to update to see invited upadtes ...)
    // Every time a slider is mofied: send changes to the server
    React.useEffect(() => {
        setSliderShared(context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, {
            ballSpeed: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.BALL_SPEED)?.[0]))),
            ballColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.BALL_COLOR)?.[0])))),
            courtColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.COURT_COLOR)?.[0])))),
            netColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.NET_COLOR)?.[0])))),
            playerOneWidth: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_WIDTH)?.[0]))),
            playerOneHeight: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_HEIGHT)?.[0]))),
            playerOneColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_ONE_COLOR)?.[0])))),
            playerTwoWidth: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_TWO_WIDTH)?.[0]))),
            playerTwoHeight: RangeSlider.RangeSliderValue(new RangeSlider(context.pongSpetializations[
                context.pongIndex][1].settingsLimits.ballSpeed, Number(sliders.get(CustomValue.PLAYER_TWO_HEIGHT)?.[0]))),
            playerTwoColor: String()
        }));
    }, [sliders, sliderShared]);

    // Handler for "Single Player" button
    const onSinglePlayer = () => {
        setGameMode(GameMode.SINGLE_PLAYER);
        // TO DO: Make the button apparence as a clicked button
    };

    // Handler for "Multi Player" button
    const onMultiplayer = () => {
        setGameMode(GameMode.MULTI_PLAYER);
        // TO DO: Make the button apparence as a clicked button
    };

    // Handler for "Invite" button
    const onInvite = () => {
        context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, sliderShared);

        // TO DO: Should notify the target user and should
        // be able to join the game and modify it own game config

        // TO DO: If a player is invited and the host changes the
        // gameMode to SINGLE_PLAYER the invited player is kicked out
    };

    // Send the pong style (whitch pong user wanna play)
    const summitGameStyle = () => {
        // TO DO: Use emuns instead where those "defines" are included
        const libs : Array<[LibNames, LibNames]> = [
            [LibNames.LIB_HORIZONTAL_SINGLE, LibNames.LIB_HORIZONTAL_MULTI],
            [LibNames.LIB_VERTICAL_SINGLE, LibNames.LIB_VERTICAL_MULTI]
        ];

        context.socket.emit(Mesages.SET_UP_GAME_STYLE,
            libs[context.pongIndex][Number(gameMode == GameMode.MULTI_PLAYER)]);
    };

    // Apply all the customization to the selected pong
    const summitGameCustomization = () => {
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.ball.speed = sliderShared.ballSpeed;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.ball.style.data = sliderShared.ballColor;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.court.style.data = sliderShared.courtColor;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.net.style.data = sliderShared.netColor;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerOne.width = sliderShared.playerOneWidth;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerOne.height = sliderShared.playerOneHeight;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerOne.style.data = sliderShared.playerOneColor;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerTwo.width = gameMode == GameMode.SINGLE_PLAYER ?
            sliderShared.playerTwoWidth : sliderShared.playerOneWidth;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerTwo.height = gameMode == GameMode.SINGLE_PLAYER ?
            sliderShared.playerTwoHeight : sliderShared.playerOneHeight;
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerTwo.style.data = sliderShared.playerTwoColor;

        if (gameMode == GameMode.SINGLE_PLAYER)
            context.socket.emit(Mesages.SET_UP_BOT_LEVEL, context.gameId, RangeSlider.RangeSliderValue({
                limits: { min: 0, max: 1 }, value: Number(sliders.get(CustomValue.PLAYER_TWO_COLOR)?.[0])
            }));
    };

    // Handler for "Ready" button
    // TO DO: Somehow indicate if the other player is ready
    const onReady = () => {
        
        // User clicked on "Ready" button (activating it)
        if (isReady == false)
        {
            context.socket.emit(Mesages.PLAYER_IS_READY, context.gameId, context.playerId);
            setIsReady(true);
        }
        // User clicked on "Ready" botton (desactivating it)
        else
        {
            context.socket.emit(Mesages.PLAYER_ISNT_READY, context.gameId, context.playerId);
            setIsReady(false);
        }

        // If both are readdy ...
        if (context.socket.emit(Mesages.ARE_PLAYERS_READY, context.gameId))
        {
            summitGameStyle();
            summitGameCustomization();

            if (gameMode == GameMode.MULTI_PLAYER)
                context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.id =
                    context.socket.emit(Mesages.GET_OTHER_PLAYER_ID, context.gameId, context.playerId);

            // TO DO: do i need this ?
            context.socket.emit(Mesages.UPDATE_CONFIG,
                context.pongSpetializations[context.pongIndex][1].gameStatus);
            
            context.socket.emit(Mesages.LAUNCH_GAME, context.gameId);
            context.goToPongGame();
        }
    };

    const onQuit = () => {
        context.socket.emit(Mesages.LEAVE_ROOM, context.gameId);
        context.goToSelection();
    };

    return (
        <>
            <div className="">
                <PongContext.Consumer>
                {
                    value =>
                    <PongStyleSelectorContext.Provider value={{...value} as IPongStyleSelectorContext}>
                        <PongStyleSelector selectorClassName="" />
                    </PongStyleSelectorContext.Provider> 
                }
                </PongContext.Consumer>
                <div className="">
                    <ButtonPong
                        content="Single Player"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onSinglePlayer}
                    />
                    <ButtonPong
                        content="Multi Player"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onMultiplayer}
                    />
                </div>
                <ButtonPong
                    content="Invite"
                    buttonClassName=""
                    divClassName=""
                    onClickHandler={onInvite}
                    disabled={gameMode == GameMode.MULTI_PLAYER ? true : undefined}
                />
                <CustomizationContext.Provider value={{sliders: sliders, gameMode: gameMode}}>
                    <Customization
                        divClassName=""
                        sliderDivClassName=""
                    />
                </CustomizationContext.Provider>
                <div className="">
                    {/* TO DO: Notify somehow if the invited player clicked on "Ready"*/}
                    <ButtonPong
                        content="Back"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onQuit}
                    />
                    <ButtonPong
                        content="Ready"
                        divClassName=""
                        buttonClassName=""
                        onClickHandler={onReady}
                    />
                </div>
            </div>
        </>
    );
}
