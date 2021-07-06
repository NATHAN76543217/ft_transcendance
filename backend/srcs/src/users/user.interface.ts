import ChannelRelationship from 'src/channels/relationships/channel-relationship.interface';
import { UserRoleTypes } from './utils/userRoleTypes';

export default interface User {
  id: number;
  name: string;
  password: string;
  nbWin: number;
  nbLoss: number;
  stats: number;
  imgPath: string;
  twoFactorAuth: boolean;
  status: string;
  role: UserRoleTypes;
  channels: ChannelRelationship[];
}
