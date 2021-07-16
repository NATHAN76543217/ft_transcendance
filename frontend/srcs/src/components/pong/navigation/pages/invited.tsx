import React from "react"

import ContiniousSlider from "../../components/continuousSlider"
import Text from "../../components/text"
import ButtonPong from "../../components/button"
import Unspected from "../../../../../../../pong/exceptions/unspected.exception"
import {
    RangeSlider,
} from "../../../../../../../pong/settings/dto/rangeslider"
import {
    LIB_VERTICAL_MULTI,
    LIB_HORIZONTAL_MULTI
} from "../../../../../../../pong/engine/lib.names"
import {
    AStyle
} from "../../../../../../../pong/render/style"
import {
    ICustomGame
} from "../.../../../../../../../../pong/server/socketserver"
import {
    Mesages
} from "../../../../../../../pong/server/socketserver"
import {
    PongContext
} from "../indexPong" 

const DEFAULT_COLOR_SLIDER : number = 42;

export default function InvitedToGame()
{
    const [value, setValue] = React.useState<number>(DEFAULT_COLOR_SLIDER);

    const context = React.useContext(PongContext);

        // TO DO:
        // Info:
        // - Customization info: both player see the customization sliders
        //          - the other player slider are disabled but the values updates real time
        // - A brief about the pong game: style , and more ? (updated real time too)
        // Brief: "Pong style: ${PONG_STYLE}"

        // -> updateInfo in customGame
        // -> replace init in the constructor by updateInfo (CustomGame)
        // -> be sure the customGame is well sync
        // -> upgrade the slider an add a disable feature
        // -> insert missing slider
        // -> update them with the shared data
        // -> end ?

    const [isReady, setIsReady] = React.useState<boolean>(false);

    // TO DO: Better with a Reducer ?
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
            value: value
        }))
    });

    setSliderShared(context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, sliderShared));

    // TO DO: Need to update render when other user does too
    // In this case it will update only if playerTwoColor is updated
    React.useEffect(() => {
        setSliderShared(context.socket.emit(Mesages.SYNC_CUSTOMIZATION, context.gameId, context.playerId, {
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
                value: value
            }))
        })); 
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

        // If both are readdy ...
        if (context.socket.emit(Mesages.ARE_PLAYERS_READY, context.gameId))
        {
            syncCustomization();
            context.socket.emit("launchGame", context.gameId);
            context.goToPongGame(); // Perhabs it work, perhabs not
        }
    }

    // Handler for "Quit" button
    const onQuit = () => {

        context.socket.emit(Mesages.LEAVE_ROOM, context.gameId, context.playerId);
        context.goToSelection(); // Perhabs it work, perhabs not
    }

    // Help to syncronize playerOne's and playerTwo's customization before launch the game
    const syncCustomization = () => {

        const libsNames : Array<string> = [
            LIB_HORIZONTAL_MULTI,
            LIB_VERTICAL_MULTI
        ];

        const pongName : string = context.socket.emit(Mesages.GET_GAME_STYLE, context.gameId);
        const index : number = libsNames.findIndex(elem => elem == pongName);

        if (index === undefined)
            throw new Unspected("Unspected error in syncCustomisation");

        context.pongSpetializations[index][1].gameStatus.playerOne.id = context.socket.emit(Mesages.GET_OTHER_PLAYER_ID, context.gameId, context.playerId);
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
            value: value
        }))

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
            <ContiniousSlider
                name="Color"
                stateShared={{value: value, setValue: setValue}}
            />
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
