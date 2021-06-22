import {
    BaseError,
    EXCEPTION
} from "./base"

export default class SettingsConfigDiffSizes extends BaseError
{
    public readonly what : string = SettingsConfigDiffSizes.name
        + EXCEPTION + "Player dimensions are not equal.";

    constructor()
    { super(); }
}