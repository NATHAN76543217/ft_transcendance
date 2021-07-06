import { Socket } from 'socket.io';
import User from 'src/users/user.interface';

export interface SocketWithUser extends Socket {
  user: User;
}
