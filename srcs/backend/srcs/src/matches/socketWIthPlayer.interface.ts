import { SocketWithUser } from 'src/authentication/socketWithUser.interface';

export interface SocketWithPlayer extends SocketWithUser {
  matchId?: number;
}
