import { Ball, IBallBase } from "../../../models/game/Ball";
import { IPlayer } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { IVector2D, Vector2D } from "../../../models/game/Vector2D";
import { canvasDims } from "../context";

function emptyCourt(context: CanvasRenderingContext2D) {
  context.fillStyle = "BLACK";
  context.fillRect(0, 0, canvasDims.x, canvasDims.y);
}

function renderizeScores(
  context: CanvasRenderingContext2D,
  status: GameStateDto
) {
  const scoreLeft: IVector2D = new Vector2D(
    (3 * canvasDims.x) / 4,
    canvasDims.y / 5
  );
  const scoreRight: IVector2D = new Vector2D(
    canvasDims.x / 4,
    canvasDims.y / 5
  );

  context.fillStyle = "#FFF";
  context.font = "75px Arial";
  context.fillText(status.scores[0].toString(), scoreLeft.x, scoreLeft.y);
  context.fillText(status.scores[1].toString(), scoreRight.x, scoreRight.y);
}

function renderizeNet(context: CanvasRenderingContext2D) {
  const width: number = 2;
  const height: number = 10;
  const pos: IVector2D = new Vector2D(canvasDims.x - width, 0);
  for (let i = 0; i < canvasDims.y; i += 15) {
    context.fillStyle = "WHITE";
    context.fillRect(pos.x, pos.y, width, height);
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
  context: CanvasRenderingContext2D
) {
  emptyCourt(context);
  renderizeScores(context, status);
  renderizeNet(context);
  status.players.forEach((player) => renderizePlayer(context, player));
  renderizeBall(context, status.ball);
}
