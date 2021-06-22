/**
 *  @file "pong_engine/shapes.ts"
 *  @brief Defines all the shapes used as base to create
 *  complex objects.
*/

import {
	AStyle
} from "./customization"

export interface IPoint
{
	x : number,
	y : number
};

/**
 *	@breif Represent a point in a 2 dimensional matrix.
 *	@member x A number type representing the vertical axis.
 *	@member y A number type representing horizontal axis.
*/
export class Point implements IPoint
{
	constructor(
		public x : number,
		public y : number
	) { }
}

/**
 *	@brief Represent a circle.
 *	@member pos A Point type representing the position of the circle
 *	@member rad A number type representnig the radius of the circle.
 *	@member style A Style type representing the visual style of the circle.
 *	@method draw A void funtion that draw the circle.
*/
export class Circle
{
	constructor(
		public pos : IPoint,
		public rad : number,
		public style : AStyle
	) { }

	public static lateralReboundHorizonal(circle : Circle)
	{ circle.pos.y = -circle.pos.y; }


	private static wrappedDraw(ctx : any, circle : Circle)
	{
		circle.style.apply(ctx);
		ctx.beginPath();
		ctx.arc(circle.pos.x, circle.pos.y, circle.rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

	/// Must use canvas's context.
	public draw(ctx : any) : void
	{ Circle.wrappedDraw(ctx, this); }
}

/**
 *	@brief Represent a rectangle.
 *	@member pos A Point type representing the postion
 *	@member width A number type representing the width of the rectangle.
 *	@member height A number type representing the height of the rectangle.
 *	@member style A Style type representing the visual style of the rectangle.
 *	@method collision A function that return a boolean type indicating if the
 *	ball collionated with the rectangle.
 *	@method draw A void funtion that draw the circle.
*/
export class Rectangle
{
	constructor(
		public pos : IPoint,
		public width : number,
		public height : number,
		public style : AStyle
	) { }

	// Perhabs i need to specilise this one too !
	public thereIsCollision(ball : Circle) : boolean
	{
		return (this.pos.x < ball.pos.x + ball.rad // rectangle left < ball right
		&& this.pos.y < ball.pos.y + ball.rad // rectangle top < ball bottom
		&& this.pos.x + this.width > ball.pos.x - ball.rad // rectangle right > ball left
		&& this.pos.y + this.height > ball.pos.y - ball.rad); // rectangle bottom > ball top
	}

	private static wrappedDraw(ctx : any, rectangle : Rectangle)
	{
		rectangle.style.apply(ctx);
		ctx.fillRect(rectangle.pos.x, rectangle.pos.y,
			rectangle.width, rectangle.height);
	}

	public draw(ctx : any) : void
	{ Rectangle.wrappedDraw(ctx, this); }
}