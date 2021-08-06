import { Ball, defaultBall, IBallBase } from "../../../models/game/Ball";
import { Side } from "../../../models/game/Player";
import { GameStateDto } from "../../../models/game/GameState.dto";
import { canvasWidth, canvasHeight } from "../../../models/game/canvasDims";

export function ruleOfThree(target: number, currCanvHeight: number) {
  return (target * currCanvHeight) / canvasHeight;
}

export function getDefaultBall(currCanvHeight: number) : Ball {
  return new Ball(
    {
      x: ruleOfThree(defaultBall.x, currCanvHeight),
      y: ruleOfThree(defaultBall.y, currCanvHeight)
    },
    {
      x: ruleOfThree(defaultBall.dir.x, currCanvHeight),
      y: ruleOfThree(defaultBall.dir.y, currCanvHeight)
    },
    ruleOfThree(defaultBall.velocity, currCanvHeight),
    Math.max(ruleOfThree(defaultBall.rad, currCanvHeight), 7)
  );
}

export function pongEngine(st: GameStateDto, currCanvHeight: number) {
  // Check if the ball scored on left side
  if (st.ball.x - st.ball.rad < 0) {
    st.scores[0]++;
    st.ball = getDefaultBall(currCanvHeight);
    //st.ball.dir.x = -st.ball.dir.x;
  }
  // Check if the ball scored on right side
  else if (st.ball.x + st.ball.rad > ruleOfThree(canvasWidth, currCanvHeight)) {
    st.scores[1]++;
    st.ball = getDefaultBall(currCanvHeight);
    st.ball.dir.x = -st.ball.dir.x;
  }

  // Check for ball rebounds in court sides
  if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > ruleOfThree(canvasHeight, currCanvHeight)) // not need this rule of 3 cause is always == currCanvHeight
    st.ball.dir.y = -st.ball.dir.y;

  // Mouse the ball
  st.ball.x += st.ball.dir.x;
  st.ball.y += st.ball.dir.y;

  const side: Side =
    st.ball.x + st.ball.rad < (ruleOfThree(canvasWidth, currCanvHeight)) / 2 ? "left" : "right";

  st.players.find((player) => {
    const isColiding = player.side === side && st.ball.isColiding(player);

    if (isColiding) {
      st.ball.rebound(player, currCanvHeight);
    }
    return isColiding;
  });
}
