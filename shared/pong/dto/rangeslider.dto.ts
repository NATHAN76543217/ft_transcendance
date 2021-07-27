import {
    AStyle
} from "../render/style"
import {
    IRange
} from "./range.dto";

export interface IRangeSliderDto
{
    limits : IRange;
    value : number;
}

export class RangeSlider implements IRangeSliderDto
{
    constructor(
		public readonly limits : IRange,
		public readonly value : number
	)
	{ }

    public static RangeSliderValue(rangeSlider : IRangeSliderDto) : number
	{
		const distance : number = rangeSlider.limits.max - rangeSlider.limits.min;
		return distance * rangeSlider.value;
	}

	/// Changes the color of the given AStyle using a range slider
	public static ISetColor(rangeSlider : IRangeSliderDto, style : AStyle) : void
	{ style.data = AStyle.NumbertoHexStr(RangeSlider.RangeSliderValue(rangeSlider)); }

	/// Changes the texture of the given AStyle using a range slider
	public static ISetTexture(rangeSlider : IRangeSliderDto, style : AStyle) : void
	{ console.log("Textures are not avalaible yet."); }

	public static toRange(limits : IRange, value : number)
	{ return (value / (limits.min - limits.max)) * 100;  }
}
