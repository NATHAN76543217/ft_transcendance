import {
    AStyle
} from "../../render/style"
import {
    IRangeDto
} from "./range";

export interface IRangeSliderDto
{
    limits : IRangeDto;
    value : number;
}

export class RangeSlider implements IRangeSliderDto
{
    constructor(
		public readonly limits : IRangeDto,
		public readonly value : number
    ) { }
    
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
}