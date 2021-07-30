import {
    defaultBall,
    IBallBase,
    IVector2D,
    canvasDims,
    Ball
} from "../context";

export interface IPlayerDto extends IVector2D {
    score : number;
}

export interface IBallDto extends IBallBase {
    rad : number;
}

export interface IStatusDto {
    playerOne : IPlayerDto;
    playerTwo : IPlayerDto;
    ball : IBallDto;
}

export const PLAYER_WIDTH : number = 10;
export const PLAYER_HEIGHT : number = 100;

// Before call it in the server call: preload both players pos in status
// Before call it in the client: just get clients mouse pos before
export function pongEngine(st : IStatusDto)
{
    // Check if the ball scored on left side
    if (st.ball.x - st.ball.rad < 0)
    {
        st.playerOne.score++;
        st.ball = defaultBall;
    }
    // Check if the ball scored on right side
    else if (st.ball.x + st.ball.rad > canvasDims.x)
    {
        st.playerTwo.score++;
        st.ball = defaultBall;
    }

    // Check for ball rebounds in court sides
    if (st.ball.y - st.ball.rad < 0 || st.ball.y + st.ball.rad > canvasDims.y)
        st.ball.y = -st.ball.y;

    // Mouse the ball
    st.ball.x += st.ball.dir.x;
    st.ball.y += st.ball.dir.y;

    // Calculate the side where the ball will impact
    const player : IPlayerDto = 
        (st.ball.x + st.ball.rad < canvasDims.x / 2) ? st.playerOne : st.playerTwo;

    // If the ball implacts on player's paddle
    if (player.x < st.ball.x + st.ball.rad
    && player.y < st.ball.y + st.ball.rad
    && player.x + PLAYER_WIDTH > st.ball.x - st.ball.rad
    && player.y + PLAYER_HEIGHT > st.ball.y - st.ball.rad)
    {
        // Change the ball direction (rebound)
        const normAngle : number =
            ((st.ball.y - (player.y + PLAYER_HEIGHT / 2)) / PLAYER_HEIGHT / 2) * (Math.PI / 4);
        const sense : number = 
            (st.ball.x + st.ball.rad < canvasDims.x / 2) ? 1 : -1;
        st.ball.dir.x = sense * st.ball.velocity * Math.cos(normAngle);
        st.ball.dir.y = st.ball.velocity * Math.sin(normAngle);

        st.ball.velocity += 0.1;
    }

    return st;
}
