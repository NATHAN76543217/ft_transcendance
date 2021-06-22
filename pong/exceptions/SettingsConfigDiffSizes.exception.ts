import {
    BaseError,
    EXCEPTION
} from "./base"

export default class SettingsConfigOutOfRange extends BaseError
{
    public readonly what : string = SettingsConfigOutOfRange.name 
        + EXCEPTION + "Player(s) dimensions are out of valid ranges.";

        constructor()
        { super(); }
}