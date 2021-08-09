import { IsNumber, Max, Min } from 'class-validator';
import { PlayerStatus } from './playerStatus';

export class PlayerStatusChangedDto {

  @IsNumber()
  @Min(1)
  userId: number;

  @IsNumber()
  @Min(0)
  @Max(4)
  status: PlayerStatus;
};
