import React from "react"

import Text from "../../components/text"
import ButtonPong from "../../components/button"
import Unspected from "shared-pong/game/exceptions/unspected.exception"
import {
    RangeSlider,
} from "shared-pong/dto/rangeslider.dto"
import LibNames from "shared-pong/utils/lib.names"
import {
    AStyle
} from "shared-pong/render/style"
import {
    ICustomGame
} from "shared-pong/dto/customgame.dto"
import {
    Mesages
} from "shared-pong/utils/messages"
import {
    PongContext
} from "../indexPong"
import {
    InvitedCustomization,
    CustomValue,
} from "../../components/customization"
import {
    ISummitDto
} from "shared-pong/dto/summit.dto"

type IInvitedCustomization = {
    sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]>;
}

type CustomizationPair = [ICustomGame, React.Dispatch<React.SetStateAction<ICustomGame>>];

export const InvitedCustomizationContext = React.createContext<IInvitedCustomization>({
    sliders: new Map()
});

export default function InvitedToGame()
{
    const context = React.useContext(PongContext);

    // True if the client is ready
    const [isReady, setIsReady] = React.useState<boolean>(false);

    // True if the opponent is ready
    const [otherIsReady, setOtherisReady] = React.useState<boolean>(false);

    // A Map holding the sliders state (value & setter)
    let sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]> =
        new Map();

    // An Object holding the customization
    const [sliderShared, setSliderShared] : CustomizationPair = React.useState<ICustomGame>({
        ballSpeed: Number(),
        ballColor: String(),
        courtColor: String(),
        netColor: String(),
        playerOneWidth: Number(),
        playerOneHeight: Number(),
        playerOneColor: String(),
        playerTwoWidth: Number(),
        playerTwoHeight: Number(),
        playerTwoColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
            limits: {
                min: 0x00000000,
                max: 0x00FFFFFF,
            },
            value: context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.style.toNumber()
        }))
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

    // Handler for "Quit" button
    const onQuit = () => {
        context.socket.emit(Mesages.LEAVE_ROOM, context.gameId, context.playerId);
        context.goToSelection();
    }

    ////////////////////////////
    // SOCKET EVENT LISTENERS //
    ////////////////////////////

    // Handler for INIT_CUSTOMIZATION's response listener
    const onInitCustomjzation = () => {
        sliders = new Map([
            [CustomValue.BALL_SPEED, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.ballSpeed, sliderShared.ballSpeed))],
            [CustomValue.BALL_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.colorLimit, parseInt(sliderShared.ballColor, 16)))],
            [CustomValue.COURT_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.colorLimit, parseInt(sliderShared.courtColor, 16)))],
            [CustomValue.NET_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.colorLimit, parseInt(sliderShared.netColor, 16)))],
            [CustomValue.PLAYER_ONE_WIDTH, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.playerOneWidth, sliderShared.playerOneWidth))],
            [CustomValue.PLAYER_ONE_HEIGHT, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.playerOneHeight, sliderShared.playerOneHeight))],
            [CustomValue.PLAYER_ONE_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.colorLimit, parseInt(sliderShared.playerOneColor, 16)))],
            [CustomValue.PLAYER_TWO_WIDTH, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.playerTwoWidth, sliderShared.playerTwoWidth))],
            [CustomValue.PLAYER_TWO_HEIGHT, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.playerTwoHeight, sliderShared.playerTwoHeight))],
            [CustomValue.PLAYER_TWO_COLOR, React.useState(RangeSlider.toRange(context.pongSpetializations[context.pongIndex][1]
                .settingsLimits.colorLimit, context.pongSpetializations[context.pongIndex][1].gameStatus.playerTwo.style.toNumber()))],
        ]);
    };

    // Handler for SYNC_CUSTOMIZATION's response listener
    const onReceiveGameCustomization = (customization : ICustomGame) => {
        setSliderShared(customization);
        sliders.get(CustomValue.BALL_SPEED)?.[1](sliderShared.ballSpeed);
        sliders.get(CustomValue.BALL_COLOR)?.[1](parseInt(sliderShared.ballColor, 16));
        sliders.get(CustomValue.COURT_COLOR)?.[1](parseInt(sliderShared.courtColor, 16));
        sliders.get(CustomValue.NET_COLOR)?.[1](parseInt(sliderShared.netColor, 16));
        sliders.get(CustomValue.PLAYER_ONE_WIDTH)?.[1](sliderShared.playerOneWidth);
        sliders.get(CustomValue.PLAYER_ONE_HEIGHT)?.[1](sliderShared.playerOneHeight);
        sliders.get(CustomValue.PLAYER_ONE_COLOR)?.[1](parseInt(sliderShared.playerOneColor, 16));
        sliders.get(CustomValue.PLAYER_TWO_WIDTH)?.[1](sliderShared.playerOneWidth);
        sliders.get(CustomValue.PLAYER_TWO_HEIGHT)?.[1](sliderShared.playerOneHeight);
    };

    // Handler for NOTIFY_IS_READY's respose listener
    const onOtherPlayerIsReady = (state : boolean) => {
        setOtherisReady(state);
    };
    
    // Handler for SYNC_READY_PLAYERS's response listener
    const onSummit = (data : ISummitDto) => {
        const libsNames : Array<LibNames> = [
            LibNames.LIB_HORIZONTAL_MULTI,
            LibNames.LIB_VERTICAL_MULTI
        ];

        const index : number = libsNames.findIndex(elem => elem == data.libName);
        if (index === undefined)
            throw new Unspected("Unspected error on SUMMIT_CUSTOMIZATION listener");
        
        context.pongSpetializations[index][1].gameStatus.playerOne.id =
            data.ids.idPlayerOne == context.playerId ? data.ids.idPlayerTwo : data.ids.idPlayerOne;
        context.pongSpetializations[index][1].gameStatus.playerTwo.id = context.playerId;
        context.pongSpetializations[index][1].gameStatus.ball.speed = sliderShared.ballSpeed;
        context.pongSpetializations[index][1].gameStatus.ball.style.data = sliderShared.ballColor;
        context.pongSpetializations[index][1].gameStatus.court.style.data = sliderShared.courtColor;
        context.pongSpetializations[index][1].gameStatus.net.style.data = sliderShared.netColor;
        context.pongSpetializations[index][1].gameStatus.playerOne.width = sliderShared.playerOneWidth;
        context.pongSpetializations[index][1].gameStatus.playerOne.height = sliderShared.playerOneHeight;
        context.pongSpetializations[index][1].gameStatus.playerOne.style.data = sliderShared.playerOneColor;
        context.pongSpetializations[index][1].gameStatus.playerTwo.width = sliderShared.playerTwoWidth;
        context.pongSpetializations[index][1].gameStatus.playerTwo.height = sliderShared.playerTwoHeight;
        context.pongSpetializations[index][1].gameStatus.playerTwo.style.data = sliderShared.playerTwoColor;
        
        context.setPongIndex(index);

        context.socket.emit(Mesages.LAUNCH_GAME, context.gameId);

        const seconds : number = 2;
        setTimeout(() => {
            context.goToPongGame();
        }, 1000 * seconds);
    }

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

        context.socket.emit(Mesages.JOIN_ROOM, context.gameId, context.playerId);
        context.socket.emit(Mesages.INIT_CUSTOMIZATION, context.gameId);
        context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, sliderShared);

        return deleteListeners;
    }, []);

    ///////////////////////////
    // REACT EVENT LISTENERS //
    ///////////////////////////

    // Update the shared slider, emit to host every time is updated
    React.useEffect(() => {
        context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, {
            ballSpeed: Number(),
            ballColor: String(),
            courtColor: String(),
            netColor: String(),
            playerOneWidth: Number(),
            playerOneHeight: Number(),
            playerOneColor: String(),
            playerTwoWidth: Number(),
            playerTwoHeight: Number(),
            playerTwoColor: AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
                limits: {
                    min: 0x00000000,
                    max: 0x00FFFFFF,
                },
                value: Number(sliders.get(CustomValue.PLAYER_TWO_COLOR)?.[0])
            }))
        });
    }, [sliderShared]);

    return (
        // TO DO: Use isReady for button style too
        <>
            <Text
                content={sliderShared.gameBrief ? sliderShared.gameBrief : "UNSPECTED ERROR"}
                divClassName=""
                textClassName=""
            />
            <InvitedCustomizationContext.Provider value={{sliders: sliders}}>
                <InvitedCustomization
                    divClassName=""
                    sliderDivClassName=""
                />
            </InvitedCustomizationContext.Provider>
            <ButtonPong
                content="Ready"
                divClassName=""
                buttonClassName=""
                onClickHandler={onClientIsReady}
            />
            <ButtonPong
                content="Quit"
                divClassName=""
                buttonClassName=""
                onClickHandler={onQuit}
            />
        </>
    );
}

