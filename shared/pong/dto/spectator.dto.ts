
import {
    ICustomGame
} from "../dto/customgame.dto"
import LibNames from "../utils/lib.names"

export interface IIds
{
    idPlayerOne: string;
    idPlayerTwo: string;
}

export interface ISpectatorDataDto
{
    ids : IIds;
    libName : LibNames;
    customization : ICustomGame;
}