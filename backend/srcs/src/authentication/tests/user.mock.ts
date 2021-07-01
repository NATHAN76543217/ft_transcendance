import { UserRoleTypes } from 'src/users/utils/userRoleTypes';
import User from '../../users/user.entity';

 
export const mockedUser: User = {
  id: 1,
  name: 'Bob',
  password: 'password',
  nbWin: 0,
  nbLoss: 0,
  stats: 0,
  imgPath: "path/img",
  school42id: null,
  googleid: null,
  jwt: "",
  twoFactorAuth: false,
  status: "",
  role: UserRoleTypes.null,
  channels: [],
  // userRelationship1: [],
  // userRelationship2: []
}
