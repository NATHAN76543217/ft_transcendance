import { Ball, defaultBall } from "../../../models/game/Ball";
import { Side } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { canvasWidth, canvasHeight } from "../../../models/game/canvasDims";

export function ruleOfThree(target: number, currCanvHeight: number) {
  return (target * currCanvHeight) / canvasHeight;
}

export function getDefaultBall() : Ball {
  return new Ball(
    {
      x: defaultBall.x,
      y: defaultBall.y
    },
    {
      x: defaultBall.dir.x,
      y: defaultBall.dir.y
    },
    defaultBall.velocity,
    defaultBall.rad
  );
}

export function pongEngine(st: GameStateDto) {
  // Check if the ball scored on left side
  if (st.ball.x - st.ball.rad < 0) {
    st.scores[0]++;
    st.ball = getDefaultBall();
    //st.ball.dir.x = -st.ball.dir.x;
  }
  // Check if the ball scored on right side
  else if (st.ball.x + st.ball.rad > canvasWidth) {
    st.scores[1]++;
    st.ball = getDefaultBall();
    st.ball.dir.x = -st.ball.dir.x;
  }

  // Check for ball rebounds in court sides
  if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > canvasHeight)
    st.ball.dir.y = -st.ball.dir.y;

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
