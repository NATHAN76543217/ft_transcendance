import User from '../../users/user.entity';
 
export const mockedUser: User = {
  id: 1,
  name: 'Bob',
  password: 'password',
  nbWin: 0,
  nbLoss: 0,
  stats: 0,
  imgPath: "path/img",
  twoFactorAuth: false,
  status: "",
  channels: []
}
