import { useContext, useEffect, useState } from "react"
import { canvasDims, defaultBall, GameContext } from "../context"
import { ClientMessages, ServerMessages } from "../dto/messages";
import {
    IStatusDto,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    pongEngine
} from "../engine/engine"
import {
    renderize
} from "../engine/render"

export function Pong() {

    const context = useContext(GameContext);

    const canvasId : string = "pongCanvas";

    // TO DO: Add to useEffect contructor ?
    const canvas : HTMLCanvasElement | null = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas === null)
        throw new Error(); // TO DO
    const ctx : CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx === null)
        throw new Error(); // TO DO

    const [status, setStatus] = useState<IStatusDto>({
        playerOne: {
            x: 0,
            y: (canvasDims.y - PLAYER_HEIGHT) / 2,
            score: 0
        },
        playerTwo: {
            x: canvasDims.x - PLAYER_WIDTH,
            y: (canvasDims.y - PLAYER_HEIGHT) / 2,
            score: 0
        },
        ball: defaultBall
    });

    canvas.addEventListener("mousemove", (event : any) => {
        const rect = canvas.getBoundingClientRect();
        setStatus({
            ...status, 
            playerOne: {
                ...status.playerTwo,
                y: event.clientY - rect.top - PLAYER_HEIGHT / 2,
            },
        });
        context.socket?.volatile.emit(ServerMessages.CALC_GAME_ST, {
            x: event.clientX,
            y: event.clientY
        });
    });

    const onReciveGameStatus = (st : IStatusDto) => {
        setStatus(st);
    };

    const deleteSubscribedListeners = () => {
        if (context.socket)
            context.socket.off(ClientMessages.RECEIVE_ST, onReciveGameStatus);
    }

    useEffect(() => {
        if (context.socket)
            context.socket.on(ClientMessages.RECEIVE_ST, onReciveGameStatus);
        return deleteSubscribedListeners;
    }, []);

    useEffect(() => {
        renderize(status, ctx);
    }, [status]);

    const frame = () => {
        setStatus(pongEngine(status));
        requestAnimationFrame(frame);
    };

    const animationId = requestAnimationFrame(frame);
    // NOTE: To stop the animation use: cancelAnimationFrame(animationId);

    // TO DO: Impose a size using canvasDims
    return (
        <canvas id={canvasId} className=""/>
    );
}
