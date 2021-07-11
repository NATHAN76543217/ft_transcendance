import {
    Player
} from "../game/player"
import {
    Ball
} from "../game/ball"
import {
    Court
} from "../game/court"
import {
    Net
} from "../game/net"
import {
    IRangeSliderDto,
    RangeSlider
} from "../settings/dto/rangeslider"

import GameObjOutOfRange from "../exceptions/gameObjOutOfRange.exception"

export interface IGameStatus
{
    court : Court;
    playerOne : Player;
    playerTwo : Player;
    ball : Ball;
}

export class GameStatus implements IGameStatus
{
    constructor(
        public court : Court,
        public playerOne : Player,
        public playerTwo : Player,
        public ball : Ball,
        public net : Net
    )
    { this.sanitize(); }

    private sanitize() : void
	{
		if (this.playerOne.x > this.court.width
			|| this.playerOne.y > this.court.height
			|| this.playerTwo.x > this.court.width
			|| this.playerTwo.y > this.court.height
			|| this.ball.x > this.court.width
			|| this.ball.y > this.court.height
			|| this.net.x > this.court.width
			|| this.net.y > this.court.height
			|| this.playerOne.width > this.court.width
			|| this.playerOne.height > this.court.height
			|| this.playerTwo.width > this.court.width
			|| this.playerTwo.height > this.court.height
			|| this.net.width > this.court.width
			|| this.net.height > this.court.height
			|| this.playerOne.limitLeft.x > this.court.width
			|| this.playerOne.limitLeft.y > this.court.height
			|| this.playerOne.limitRight.x > this.court.width
			|| this.playerOne.limitRight.y > this.court.width
			|| this.playerTwo.limitLeft.x > this.court.width
			|| this.playerTwo.limitLeft.y > this.court.height
			|| this.playerTwo.limitRight.x > this.court.width
			|| this.playerTwo.limitRight.y > this.court.width
			|| this.playerOne.score.x > this.court.width
			|| this.playerOne.score.y > this.court.height
			|| this.playerTwo.score.x > this.court.width
			|| this.playerTwo.score.y > this.court.height
			//
			|| this.playerOne.x < 0
			|| this.playerOne.y < 0
			|| this.playerTwo.x < 0
			|| this.playerTwo.y < 0
			|| this.ball.x < 0
			|| this.ball.y < 0
			|| this.net.x < 0
			|| this.net.y < 0
			|| this.playerOne.width < 0
			|| this.playerOne.height <= 0
			|| this.playerTwo.width <= 0
			|| this.playerTwo.height <= 0
			|| this.net.width <= 0
			|| this.net.height <= 0
			|| this.playerOne.limitLeft.x < 0
			|| this.playerOne.limitLeft.y < 0
			|| this.playerOne.limitRight.x < 0
			|| this.playerOne.limitRight.y < 0
			|| this.playerTwo.limitLeft.x < 0
			|| this.playerTwo.limitLeft.y < 0
			|| this.playerTwo.limitRight.x < 0
			|| this.playerTwo.limitRight.y < 0
			|| this.playerOne.score.x < 0
			|| this.playerOne.score.y < 0
			|| this.playerOne.score.x < 0
			|| this.playerOne.score.y < 0)
                throw new GameObjOutOfRange();
    }

    /*
	*	The following properties are customizables
	*	by the final user:
	*	- court color
	*	- court texture
	*	- full screen on
	*	- full screen off
	*	- player1 paddle width
	*	- player2 paddle width
	*	- player1 paddle height
	*	- player2 paddle height
	*	- player1 paddle color
	*	- player2 paddle color
	*	- player1 paddle texture
	*	- player2 paddle texture
	*	- ball color
	*	- ball texture
	*	- ball speed
	*	- net width
	*	- net hight
	*	- net color
	*	- net texture
	*/

	set courtColor(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetColor(rangeSlider, this.court.style); }

	set courtTexture(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetTexture(rangeSlider, this.court.style); }

	public toFullScreen() : void // TO DO
	{ }

	public toDefaultScreen() : void // TO DO
	{ }

	set player1Width(rangeSlider : IRangeSliderDto)
	{ this.playerOne.width = RangeSlider.RangeSliderValue(rangeSlider); }

	set player1Height(rangeSlider : IRangeSliderDto)
	{ this.playerOne.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set player2Width(rangeSlider : IRangeSliderDto)
	{ this.playerTwo.width = RangeSlider.RangeSliderValue(rangeSlider); }

	set player2Height(rangeSlider : IRangeSliderDto)
	{ this.playerTwo.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set player1Color(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetColor(rangeSlider, this.playerOne.style); }

	set player2Color(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetColor(rangeSlider, this.playerTwo.style); }

	set player1Texture(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetTexture(rangeSlider, this.playerOne.style); }

	set player2Texture(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetTexture(rangeSlider, this.playerTwo.style); }

	set ballColor(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetColor(rangeSlider, this.ball.style); }

	set ballTexture(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetTexture(rangeSlider, this.ball.style); }

	set ballSpeed(rangeSlider : IRangeSliderDto)
	{ this.ball.speed = RangeSlider.RangeSliderValue(rangeSlider); }

	set netHeight(rangeSlider : IRangeSliderDto)
	{ this.net.height = RangeSlider.RangeSliderValue(rangeSlider); }

	set netColor(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetColor(rangeSlider, this.net.style); }

	set netTexture(rangeSlider : IRangeSliderDto)
	{ RangeSlider.ISetTexture(rangeSlider, this.net.style); }
}