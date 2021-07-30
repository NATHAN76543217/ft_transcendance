import {
    IStatusDto,
    IPlayerDto,
    IBallDto,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
} from "./engine"
import {
    canvasDims,
    IVector2D,
    Vector2D
} from "../context"

function emptyCourt(context : CanvasRenderingContext2D) {
    context.fillStyle = "BLACK";
    context.fillRect(0, 0, canvasDims.x, canvasDims.y);
}

function renderizeScores(context : CanvasRenderingContext2D, status : IStatusDto) {
    const scoreLeft : IVector2D = new Vector2D(3 * canvasDims.x / 4, canvasDims.y / 5);
    const scoreRight : IVector2D = new Vector2D(canvasDims.x / 4, canvasDims.y / 5);

    context.fillStyle = "#FFF";
    context.font = "75px Arial";
    context.fillText(status.playerOne.score.toString(), scoreLeft.x, scoreLeft.y);
    context.fillText(status.playerTwo.score.toString(), scoreRight.x, scoreRight.y);
}

function renderizeNet(context : CanvasRenderingContext2D) {
    const width : number = 2;
    const height : number = 10;
    const pos : IVector2D = new Vector2D((canvasDims.x - width), 0);
    for (let i = 0 ; i < canvasDims.y ; i += 15)
    {
        context.fillStyle = "WHITE";
        context.fillRect(pos.x, pos.y, width, height);
    }
}

function renderizePlayer(context : CanvasRenderingContext2D, player : IPlayerDto) {
    context.fillStyle = "WHITE";
    context.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function renderizeBall(context : CanvasRenderingContext2D, ball : IBallDto) {
    context.fillStyle = "RED";
    context.beginPath();
    context.arc(ball.x, ball.y, ball.rad, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

export function renderize(status : IStatusDto, context : CanvasRenderingContext2D) {
    emptyCourt(context);
    renderizeScores(context, status);
    renderizeNet(context);
    renderizePlayer(context, status.playerOne);
    renderizePlayer(context, status.playerTwo);
    renderizeBall(context, status.ball);
}
