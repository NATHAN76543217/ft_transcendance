import { UserRole } from 'src/users/utils/userRole';
import { UserStatus } from 'src/users/utils/userStatus';
import User from '../../users/user.entity';

export const mockedUser: User = {
  id: 1,
  name: 'Bob',
  password: 'password',
  nbWin: 0,
  nbLoss: 0,
  stats: 0,
  imgPath: 'path/img',
  school42id: null,
  googleid: null,
  jwt: '',
  twoFactorAuthEnabled: false,
  firstConnection: true,
  status: UserStatus.null,
  roomId: 1,
  role: UserRole.User,
  channels: [],
  // messages: [],
  // userRelationship1: [],
  // userRelationship2: []
};
