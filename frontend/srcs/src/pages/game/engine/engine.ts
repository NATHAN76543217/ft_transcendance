import { defaultBall } from "../../../models/game/Ball";
import { Side } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { canvasWidth, canvasHeight } from "../../../models/game/canvasDims";

// Before call it in the server call: preload both players pos in status
// Before call it in the client: just get clients mouse pos before
export function pongEngine(st: GameStateDto) {
  // Check if the ball scored on left side
  if (st.ball.x - st.ball.rad < 0) {
    st.scores[0]++;
    st.ball = defaultBall;
  }
  // Check if the ball scored on right side
  else if (st.ball.x + st.ball.rad > canvasWidth) {
    st.scores[1]++;
    st.ball = defaultBall;
  }

  // Check for ball rebounds in court sides
  if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > canvasHeight)
    st.ball.y = -st.ball.y;

  // Mouse the ball
  st.ball.x += st.ball.dir.x;
  st.ball.y += st.ball.dir.y;

  const side: Side =
    st.ball.x + st.ball.rad < canvasWidth / 2 ? "left" : "right";

  st.players.find((player) => {
    const isColiding = player.side === side && st.ball.isColiding(player);

    if (isColiding) {
      st.ball.rebound(player);
    }
    return isColiding;
  });
}
