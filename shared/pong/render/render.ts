import {
    Direction
} from "../game/net";
import {
    GameStatus
} from "../game/status"

export default function renderGameStatus(gameStatus : GameStatus)
{
    const ctx : CanvasRenderingContext2D = gameStatus.court.ctx;

    // Empty the court
    gameStatus.court.draw(ctx);

    // Display Scores
    gameStatus.playerOne.score.draw(ctx);
    gameStatus.playerTwo.score.draw(ctx);

    gameStatus.net.draw(ctx,
        gameStatus.net.direction == Direction.VERTICAL
        ? gameStatus.court.height : gameStatus.court.width);

    // Display the players (paddles)
    gameStatus.playerOne.draw(ctx);
    gameStatus.playerTwo.draw(ctx);

    // Display the ball
    gameStatus.ball.draw(ctx);
}
