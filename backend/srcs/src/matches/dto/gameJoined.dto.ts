import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { GameRole } from '../models/GameRole';

export class GameJoinedDto {

  @IsString()
  role: GameRole;
};
