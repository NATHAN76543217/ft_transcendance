
/**
 *  @file "pong_engine/engine.ts"
 *  @brief Contains the underlying engine which makes
 *  the pongs kind happen.
*/

import { Ball, Config, Court, Player } from "./shared"

// TO DO: Document this.
export class Engine
{
    config : Config

    constructor(config : Config)
    {
        this.config = config;
    }

    // TO DO: Some data defined here will come in the config too.
    // Need to do the game setting.
    run() : void
    {
        const update = () : void =>
        {
            
            this.config.court.check_player_scored(
                this.config.player1, this.config.player2,
                this.config.ball);

            (function update_ball_pos(ball : Ball) : void
            {
                ball.pos.x += ball.velocity.x;
                ball.pos.y += ball.velocity.y;
            })(this.config.ball);

            // TO DO: For the moment there's always a bot
            (function update_bot_pos(bot : Player, ball : Ball) : void
            {
                const level : number = 0.1;

                bot.pos.y += ((ball.pos.y - (bot.pos.y + bot.height / 2))) * level;
            })(this.config.player2, this.config.ball);

            (function on_border_collision(court : Court, ball : Ball) : void
            {
                if (court.check_border_collison(ball))
                    ball.rebound();
            })(this.config.court, this.config.ball);

            (function on_paddle_collision(config : Config) : void
            {
                // TO DO: This is not dynamic (only horizontal games)
                const player : Player = (config.ball.pos.x + config.ball.rad
                    < config.court.width / 2) ? config.player1 : config.player2;

                if (player.collision(config.ball))
                {
                    (function update_ball_velocity(ball : Ball) : void
                    {
                        /// Get a normalized angle for work in {-1, 1} interval.
                        const norm_angle : number = (ball.pos.y - (player.pos.y
                            + player.height / 2)) / player.height / 2;

                        /// Get a in radian the normalized angle
                        /// Default angles:
                        /// -45 (-PI / 4) (ball hit on the top)
                        /// 0 (ball hit on the middle)
                        /// 45 (PI / 4) (ball hit on the bottom)
                        const rad_angle : number = (Math.PI / 4) * norm_angle;

                        // TO DO: Here change the velocity
                        // Wanna to do it dynamically for vertical/horizonal courts

                        ball.speed += 0.5;
                    })(config.ball);
                }
            })(this.config);
      

        };

        const render = () : void =>
        {

            const ctx : any = this.config.court.ctx;

            (function clear_court(court : Court) : void
            {
                court.clear();
            })(this.config.court);

            (function display_scores(config : Config) : void
            {
                config.player1.score.draw(ctx);
                config.player2.score.draw(ctx);
            })(this.config);

            (function display_net(config : Config) : void
            {
                config.net.draw_net(ctx, 
                    config.net.direction == "vertical"
                    ? config.court.height : config.court.width);
            })(this.config);

            (function display_players(config : Config) : void
            {
                config.player1.draw(ctx);
                config.player2.draw(ctx);
            })(this.config);
            
            (function display_ball(ball : Ball) : void
            {  
                ball.draw(ctx);
            })(this.config.ball);
        };

        (function run_frames() : void
        {
            const fps : number = 50;

            setInterval(() : void => { update(); render(); }, 1000 / fps);
        })();
    }
}

