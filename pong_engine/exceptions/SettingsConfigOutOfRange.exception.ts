import {
    BaseError,
    EXCEPTION
} from "./base"

export default class SettingsConfigInvalidBallSpeed extends BaseError
{
    public readonly what : string = SettingsConfigInvalidBallSpeed.name
        + EXCEPTION + "Ball speed is out of valid ranges.";

    constructor()
    { super(); }
}