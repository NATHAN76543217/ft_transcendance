import { Ball } from "../../../models/game/Ball";
import { IPlayer } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { IVector2D, Vector2D } from "../../../models/game/Vector2D";
import { canvasWidth, canvasHeight } from "../../../models/game/canvasDims";
import { ruleOfThree } from "./engine"

function emptyCourt(context: CanvasRenderingContext2D) {
  context.fillStyle = "BLACK";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

// NOTE: Their left corners are in the middle
function renderizeScores(
  context: CanvasRenderingContext2D,
  status: GameStateDto,
  currCanvHeight: number
) {
  const scoreLeft: IVector2D = new Vector2D(
    ruleOfThree(3 * canvasWidth / 4, currCanvHeight),
    ruleOfThree(canvasHeight / 5, currCanvHeight)
  );
  const scoreRight: IVector2D = new Vector2D(
    ruleOfThree(canvasWidth / 4, currCanvHeight),
    ruleOfThree(canvasHeight / 5, currCanvHeight)
  );

  context.fillStyle = "#FFF";
  context.font = "75px Arial";
  context.fillText(status.scores[0].toString(), scoreLeft.x, scoreLeft.y);
  context.fillText(status.scores[1].toString(), scoreRight.x, scoreRight.y);
}

function renderizeNet(context: CanvasRenderingContext2D, currCanvHeight : number) {
  const width: number = ruleOfThree(2, currCanvHeight);
  const height: number = ruleOfThree(10, currCanvHeight);
  const pos: IVector2D = new Vector2D((ruleOfThree(canvasWidth, currCanvHeight) - width) / 2, 0);
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
  currCanvHeight : number,
) {
  emptyCourt(context);
  renderizeScores(context, status, currCanvHeight);
  renderizeNet(context, currCanvHeight);
  status.players.forEach((player) => renderizePlayer(context, player));
  renderizeBall(context, status.ball);
}
