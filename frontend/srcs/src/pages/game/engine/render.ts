import { Ball } from "../../../models/game/Ball";
import { IPlayer } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { IVector2D } from "../../../models/game/Vector2D";
import { canvasHeight, canvasWidth } from "../../../models/game/canvasDims";

function emptyCourt(context: CanvasRenderingContext2D) {
  context.fillStyle = "BLACK";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  // context.fillRect(0, 0, canvasWidth, canvasHeight);
}

// NOTE: Their left corners are in the middle
function renderizeScores(
  context: CanvasRenderingContext2D,
  status: GameStateDto,
) {
  const scoreLeft: IVector2D = {
    x: canvasWidth / 4,
    y: canvasHeight / 5
  };
  const scoreRight: IVector2D = {
    x: 3 * canvasWidth / 4,
    y: canvasHeight / 5
  };

  context.fillStyle = "#FFF";
  context.font = canvasHeight > 450 ? "75px Arial" : "40px Arial";
  context.fillText(status.scores[0].toString(), scoreLeft.x, scoreLeft.y);
  context.fillText(status.scores[1].toString(), scoreRight.x, scoreRight.y);
}

function renderizeNet(context: CanvasRenderingContext2D) {
  const width: number = 2;
  const height: number = 10;
  const pos: IVector2D = {
    x: (canvasWidth - width) / 2,
    y: 0
  };
  for (let i = 0; i < canvasHeight; i += 15) {
    context.fillStyle = "WHITE";
    context.fillRect(pos.x, pos.y + i, width, height);
  }
}

function renderizePlayer(context: CanvasRenderingContext2D, player: IPlayer) {
  context.fillStyle = "WHITE";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function renderizeBall(context: CanvasRenderingContext2D, ball: Ball) {
  context.fillStyle = "RED";
  context.beginPath();
  context.arc(ball.x, ball.y, ball.rad, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}

export function renderize(
  status: GameStateDto,
  context: CanvasRenderingContext2D,
) {
  // console.log('renderize ', status)
  emptyCourt(context);
  renderizeScores(context, status);
  renderizeNet(context);
  status.players.forEach((player) => renderizePlayer(context, player));
  renderizeBall(context, status.ball);
}
