import ChannelRelationship from 'src/channels/relationships/channel-relationship.interface';
import { UserRole } from './utils/userRole';
import { UserStatus } from './utils/userStatus';

export default interface User {
  id: number;
  name: string;
  password: string;
  nbWin: number;
  nbLoss: number;
  stats: number;
  imgPath: string;
  twoFactorAuth: boolean;
  status: UserStatus;
  role: UserRole;
  channels: ChannelRelationship[];
}
