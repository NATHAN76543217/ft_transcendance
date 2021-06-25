/**
 *	@file "pong_engine/frondend_objs.ts"
 *	@brief Defines all the related objects with the
 *	pong and the frontend (which aren't game objects).
*/

import { AStyle } from "./customization"

interface IRange
{
	min : number;
	max : number;
}

/**
 *	@brief Represents a range between 2 values in a 2
 *	dimensional axis.
 *	@member min Represent the lower limit.
 *	@member max Represent the greather limit.
*/
export class Range implements IRange
{
	constructor(
		public readonly min : number,
		public readonly max : number
	) { }
}

export interface IRangeSlider
{
	limits : IRange
	value : number;
}

/**
 *	@brief Represent a range slider.
 *	@member limits The range
 *	@member value A 0 to 1 value representing a pourcentage of the range.
*/
export class RangeSlider implements IRangeSlider
{
	constructor(
		public readonly limits : IRange,
		public readonly value : number
	) { }

	/**
	 *	@brief Update target's value
	 *	@param min The minimal value possible
	 *	@param max The maximal value possible
	 *	@param value Between 0 and 1. Represent the result of a range slider.
	 *	@return 
	*/
	public static RangeSliderValue(rangeSlider : IRangeSlider) : number
	{
		const distance : number = rangeSlider.limits.max - rangeSlider.limits.min;
		return distance * rangeSlider.value;
	}

	/// Changes the color of the given Style
	public static ISetColor(rangeSlider : IRangeSlider, style : AStyle) : void
	{ style.data = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(rangeSlider)); }

	/// Changes the texture of the gien Style
	public static ISetTexture(rangeSlider : IRangeSlider, style : AStyle) : void
	{ console.log("Textures are not avalaible yet."); }
}