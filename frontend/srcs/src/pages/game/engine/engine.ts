import { defaultBall } from "../../../models/game/Ball";
import { Side } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";

import { canvasDims } from "../context";

// Before call it in the server call: preload both players pos in status
// Before call it in the client: just get clients mouse pos before
export function pongEngine(st: GameStateDto) {
  // Check if the ball scored on left side
  if (st.ball.x - st.ball.rad < 0) {
    st.scores[0]++;
    st.ball = defaultBall;
  }
  // Check if the ball scored on right side
  else if (st.ball.x + st.ball.rad > canvasDims.x) {
    st.scores[1]++;
    st.ball = defaultBall;
  }

  // Check for ball rebounds in court sides
  if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > canvasDims.y)
    st.ball.y = -st.ball.y;

  // Mouse the ball
  st.ball.x += st.ball.dir.x;
  st.ball.y += st.ball.dir.y;

  const side: Side =
    st.ball.x + st.ball.rad < canvasDims.x / 2 ? "left" : "right";

  st.players.find((player) => {
    if (player.side === side) {
      // If the ball implacts on player's paddle
      if (
        player.x < st.ball.x + st.ball.rad &&
        player.y < st.ball.y + st.ball.rad &&
        player.x + player.width > st.ball.x - st.ball.rad &&
        player.y + player.height > st.ball.y - st.ball.rad
      ) {
        // Change the ball direction (rebound)
        const normAngle: number =
          ((st.ball.y - (player.y + player.height / 2)) / player.height / 2) *
          (Math.PI / 4);
        const sense: number =
          st.ball.x + st.ball.rad < canvasDims.x / 2 ? 1 : -1;
        st.ball.dir.x = sense * st.ball.velocity * Math.cos(normAngle);
        st.ball.dir.y = st.ball.velocity * Math.sin(normAngle);

        st.ball.velocity += 0.1;

        return true;
      }
      return false;
    }
  });
}
