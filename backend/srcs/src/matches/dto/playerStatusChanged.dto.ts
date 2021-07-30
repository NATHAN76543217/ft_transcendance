import { PlayerStatus } from './playerStatus';

export type PlayerStatusChangedDto = {
  userId: number;
  status: PlayerStatus;
};
