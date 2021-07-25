import React from 'react'

import {
    GameMode
} from "shared-pong/utils/gamemode"
import PongGenerator from "shared-pong/engine/engine"
import {
    IRoomDto
} from "shared-pong/dto/room.dto"
import {
    RangeSlider
} from "shared-pong/dto/rangeslider.dto"
import ButtonPong from '../../components/button'
import PongStyleSelector from '../../components/ponsStyleSelector'
import {
    Customization,
    CustomValue
} from "../../components/customization"
import LibNames from "shared-pong/utils/lib.names"
import {
    ICustomGame
} from "shared-pong/dto/customgame.dto"
import {
    AStyle
} from "shared-pong/render/style"
import {
    PongContext,
} from "../indexPong"
import {
    Mesages
} from "shared-pong/utils/messages"
import {
    ISummitDto
} from "shared-pong/dto/summit.dto"

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
// TO DO: Set in host and invited if the other player clicked on ready

// TO DO: What happens if host invites a client and then host click on SINGLE PLAYER ?!?!
// -> Can be an alert
// -> If user click on 'ok' invited player will be kicked out

// TO DO: IN second use effects in "REACT EVENT LISTENERS"

export default function GameCustom()
{
    const context = React.useContext(PongContext);

    // Handle SINGLEPLAYER, MULTIPLAYER mode value
    const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.MULTI_PLAYER);

    // True if the client is ready
    const [isReady, setIsReady] = React.useState<boolean>(false);

    // True if the opponent is ready
    const [otherIsReady, setOtherisReady] = React.useState<boolean>(false);

    // A Map holding the sliders state (value & setter)
    let sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]> =
        new Map();

    // An Object holding the customization
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

    ////////////////////
    // BUTTON ONCLICK //
    ////////////////////

    // Handler for "Ready" button
    const onClientIsReady = () => {
        setIsReady(!isReady);
        context.socket.emit(Mesages.NOTIFY_IS_READY, context.gameId, context.playerId, isReady);
        if (otherIsReady && isReady)
        {
            const seconds : number = 2;
            setTimeout(() => {
                if (otherIsReady && isReady)
                    context.socket.emit(Mesages.SYNC_READY_PLAYERS, context.gameId);
            }, 1000 * seconds);
        }
    };

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

    // Handler for "Quit" button
    const onQuit = () => {
        context.socket.emit(Mesages.LEAVE_ROOM, context.gameId);
        context.goToSelection();
    };

    ////////////////////////////
    // SOCKET EVENT LISTENERS //
    ////////////////////////////

    // Handler for INIT_CUSTOMIZATION's response listener
    const onInitCustomjzation = () => {
        sliders = new Map([
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
    };

    // Handler for SYNC_CUSTOMIZATION's response listener
    const onReceiveGameCustomization = (customization : ICustomGame) => {
        sliders.get(CustomValue.PLAYER_TWO_COLOR)?.[1](parseInt(customization.playerTwoColor, 16))
    };

    // Handler for NOTIFY_IS_READY's respose listener
    const onOtherPlayerIsReady = (state : boolean) => {
        setOtherisReady(state);
    };

    // Handler for SYNC_READY_PLAYERS's response listener
    const onSummit = (data : ISummitDto) => {
        context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerOne.id = context.playerId;
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
                limits: {
                    min: 0,
                    max: 1
                },
                value: Number(sliders.get(CustomValue.PLAYER_TWO_COLOR)?.[0])
            }));
        else
            context.pongSpetializations[context.pongIndex][1]
            .gameStatus.playerTwo.id = data.ids.idPlayerOne == context.playerId ?
            data.ids.idPlayerTwo : data.ids.idPlayerOne;

        context.socket.emit(Mesages.LAUNCH_GAME, context.gameId);

        const seconds : number = 2;
        setTimeout(() => {
            context.goToPongGame();
        }, 1000 * seconds);
    };

    // Unsubcribe all listeners
    const deleteListeners = () => {
        context.socket.off(Mesages.RECEIVE_INIT_CUSTOMIZATION, onInitCustomjzation);
        context.socket.off(Mesages.RECEIVE_GAME_CUSTOMIZATION, onReceiveGameCustomization);
        context.socket.off(Mesages.OTHER_IS_READY, onOtherPlayerIsReady);
        context.socket.off(Mesages.SUMMIT_CUSTOMIZATION, onSummit);
    }

    // Subscribe on the listeners, then on destruction unsubscribe them (and init customization)
    React.useEffect(() => {
        context.socket.on(Mesages.RECEIVE_INIT_CUSTOMIZATION, onInitCustomjzation);
        context.socket.on(Mesages.RECEIVE_GAME_CUSTOMIZATION, onReceiveGameCustomization);
        context.socket.on(Mesages.OTHER_IS_READY, onOtherPlayerIsReady);
        context.socket.on(Mesages.SUMMIT_CUSTOMIZATION, onSummit);

        // Create a room in the server
        context.socket.emit(Mesages.CREATE_ROOM, {
            idRoom: context.playerId,
            idPlayerOne: context.playerId,
            idPlayerTwo: String(),
            config: { },
            libName: String(),
            mode: gameMode,
            customization: { },
            info: { },
        } as IRoomDto);
        context.socket.emit(Mesages.INIT_CUSTOMIZATION, context.gameId);
        context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, sliderShared);

        context.setGameId(context.playerId);

        return deleteListeners;
    }, []);

    ///////////////////////////
    // REACT EVENT LISTENERS //
    ///////////////////////////

    // Update the shared slider, emit to invited every time is updated
    React.useEffect(() => {
        context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, {
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
        });
    }, [sliderShared]);

    // Update the pong engine in the server each time the pong style changes
    React.useEffect(() => {
        const libs : Array<[LibNames, LibNames]> = [
            [LibNames.LIB_HORIZONTAL_SINGLE, LibNames.LIB_HORIZONTAL_MULTI],
            [LibNames.LIB_VERTICAL_SINGLE, LibNames.LIB_VERTICAL_MULTI]
        ];
        // TO DO: Emit to the invited if gameMode == MULTI & update invited brief (in the server)
        context.socket.emit(Mesages.SET_UP_GAME_STYLE,
            libs[context.pongIndex][Number(gameMode == GameMode.MULTI_PLAYER)]);
    }, [context.pongIndex, gameMode]);

    return (
        <>
            <div className="">
                <PongContext.Consumer>
                {
                    value  =>
                    <PongStyleSelectorContext.Provider value={value as IPongStyleSelectorContext}>
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
                        onClickHandler={onClientIsReady}
                    />
                </div>
            </div>
        </>
    );
}
