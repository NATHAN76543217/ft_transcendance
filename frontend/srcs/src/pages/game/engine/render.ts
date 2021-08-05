import { Ball } from "../../../models/game/Ball";
import { IPlayer } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { IVector2D, Vector2D } from "../../../models/game/Vector2D";
import { canvasWidth, canvasHeight, whRatio } from "../../../models/game/canvasDims";
import { ruleOfThree } from "./engine"

function emptyCourt(context: CanvasRenderingContext2D, currHeight: number) {
  context.fillStyle = "BLACK";
  context.fillRect(0, 0, currHeight * whRatio, currHeight);
  // context.fillRect(0, 0, canvasWidth, canvasHeight);
}

// NOTE: Their left corners are in the middle
function renderizeScores(
  context: CanvasRenderingContext2D,
  status: GameStateDto,
  currCanvHeight: number
) {
  const scoreLeft: IVector2D = {
    x: currCanvHeight * whRatio * 3 / 4,
    y: currCanvHeight / 5
  };
  const scoreRight: IVector2D = {
    x: currCanvHeight * whRatio / 4,
    y: currCanvHeight / 5
  };

  context.fillStyle = "#FFF";
  context.font = currCanvHeight > 450 ? "75px Arial" : "40px Arial";
  context.fillText(status.scores[0].toString(), scoreLeft.x, scoreLeft.y);
  context.fillText(status.scores[1].toString(), scoreRight.x, scoreRight.y);
}

function renderizeNet(context: CanvasRenderingContext2D, currCanvHeight: number) {
  const width: number = ruleOfThree(2, currCanvHeight);
  const height: number = ruleOfThree(10, currCanvHeight);
  const pos: IVector2D = {
    x: currCanvHeight * whRatio / 2,
    y: 0
  };
  for (let i = 0; i < currCanvHeight; i += 15) {
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
  currCanvHeight: number,
) {
  // console.log('renderize - h: ', currCanvHeight)
  emptyCourt(context, currCanvHeight);
  renderizeScores(context, status, currCanvHeight);
  renderizeNet(context, currCanvHeight);
  status.players.forEach((player) => renderizePlayer(context, player));
  renderizeBall(context, status.ball);
}
