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
    Customization
} from "../../components/customization"

type IInvitedCustomization = {
    sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]>;
}

export const InvitedCustomizationContext = React.createContext<IInvitedCustomization>({
    sliders: new Map()
});

export default function InvitedToGame()
{
    const context = React.useContext(PongContext);

    const [allReady, setAllReady] = React.useState<boolean>(false);

    context.socket.on(Mesages.RECEIVE_PLAYERS_ARE_READY, (status : boolean) => {
        setAllReady(true);
    });

    const [isReady, setIsReady] = React.useState<boolean>(false);

    const [sliderShared, setSliderShared] = React.useState<ICustomGame>({
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

    context.socket.on(Mesages.RECEIVE_GAME_CUSTOMIZATION, (customization : ICustomGame) => {
        setSliderShared(customization);
    });

    context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, sliderShared);
    context.socket.emit(Mesages.GET_CUSTOMIZATION, context.gameId);

    // TO DO: SomeHow syncronize client-server

    // Init sliders data using host's custom data (except for playerTwo color)
    const sliders : Map<CustomValue, [number, React.Dispatch<React.SetStateAction<number>>]> = new Map([
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

    // TO DO: Need to update render when other user does too
    React.useEffect(() => {
        // Send playerTwo color to host
        // Receive others customization values from host
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

        context.socket.emit(Mesages.GET_CUSTOMIZATION, context.gameId);

        // TO DO: Somehow syncronize server-client before using sliderShared

        // Update all the sliders data using received host's custom data
        sliders.get(CustomValue.BALL_SPEED)?.[1](sliderShared.ballSpeed);
        sliders.get(CustomValue.BALL_COLOR)?.[1](parseInt(sliderShared.ballColor, 16));
        sliders.get(CustomValue.COURT_COLOR)?.[1](parseInt(sliderShared.courtColor, 16));
        sliders.get(CustomValue.NET_COLOR)?.[1](parseInt(sliderShared.netColor, 16));
        sliders.get(CustomValue.PLAYER_ONE_WIDTH)?.[1](sliderShared.playerOneWidth);
        sliders.get(CustomValue.PLAYER_ONE_HEIGHT)?.[1](sliderShared.playerOneHeight);
        sliders.get(CustomValue.PLAYER_ONE_COLOR)?.[1](parseInt(sliderShared.playerOneColor, 16));
        sliders.get(CustomValue.PLAYER_TWO_WIDTH)?.[1](sliderShared.playerOneWidth);
        sliders.get(CustomValue.PLAYER_TWO_HEIGHT)?.[1](sliderShared.playerOneHeight);
    }, [sliderShared]);

    // Handler for "Ready" button
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

        context.socket.emit(Mesages.ARE_PLAYERS_READY, context.gameId);

        // TO DO: Sync alReady

        // If both are readdy ...
        if (allReady)
        {
            syncCustomization();
            context.socket.emit(Mesages.LAUNCH_GAME, context.gameId);
            context.goToPongGame();
        }
    }

    // Handler for "Quit" button
    const onQuit = () => {

        context.socket.emit(Mesages.LEAVE_ROOM, context.gameId, context.playerId);
        context.goToSelection();
    }

    // Help to syncronize playerOne's and playerTwo's customization before launch the game
    const syncCustomization = () => {

        const libsNames : Array<LibNames> = [
            LibNames.LIB_HORIZONTAL_MULTI,
            LibNames.LIB_VERTICAL_MULTI
        ];

        let pongName : LibNames | undefined = undefined;
        let otherPlayerId : string | undefined = undefined;

        context.socket.on(Mesages.RECEIVE_GAME_STYLE, (receivedLib : LibNames) => {
            pongName = receivedLib;
        });

        context.socket.on(Mesages.RECEIVE_OTHER_PLAYER_ID, (id : string) => {
            otherPlayerId = id;
        });

        context.socket.emit(Mesages.GET_GAME_STYLE, context.gameId);

        if (pongName === undefined)
            throw new Error();

        // TO DO: Somehow syncronize before use pongName

        const index : number = libsNames.findIndex(elem => elem == pongName);

        if (index === undefined || otherPlayerId === undefined)
            throw new Unspected("Unspected error in syncCustomisation");
        
        // TO DO: Somehow syncronize before using otherPlayerId

        context.pongSpetializations[index][1].gameStatus.playerOne.id = otherPlayerId;
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
        context.pongSpetializations[index][1].gameStatus.playerTwo.style.data = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue({
            limits: {
                min: 0x00000000,
                max: 0x00FFFFFF
            },
            value: parseInt(sliderShared.playerTwoColor, 16)
        }));

        context.setPongIndex(index);
    }

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
                onClickHandler={onReady}
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
