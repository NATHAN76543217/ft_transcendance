import { Logger } from '@nestjs/common';
import { Ball, defaultBall } from './models/Ball';
import { canvasDims } from './models/canvasDims';
import { GameState } from './models/GameRoom';
import { Side } from './models/Player';

export function pongEngine(st: GameState) {
  // Check if the ball scored on left side
  if (st.ball.x - st.ball.rad < 0) {
    st.scores[0]++;
    st.ball = new Ball(
      {
        x: defaultBall.x,
        y:defaultBall.y
      },
      {
        x: defaultBall.dir.x,
        y: defaultBall.dir.y
      },
      defaultBall.velocity,
      defaultBall.rad
    );
  }
  // Check if the ball scored on right side
  else if (st.ball.x + st.ball.rad > canvasDims.x) {
    st.scores[1]++;
    st.ball = new Ball(
      {
        x: defaultBall.x,
        y:defaultBall.y
      },
      {
        x: -defaultBall.dir.x,
        y: defaultBall.dir.y
      },
      defaultBall.velocity,
      defaultBall.rad
    );
  }

  // Check for ball rebounds in court sides
  if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > canvasDims.y)
    st.ball.dir.y = -st.ball.dir.y;

  // Mouse the ball
  st.ball.x += st.ball.dir.x;
  st.ball.y += st.ball.dir.y;

  const side: Side =
    st.ball.x + st.ball.rad < canvasDims.x / 2 ? 'left' : 'right';

  Array.from(st.players.values()).find((player) => {
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
