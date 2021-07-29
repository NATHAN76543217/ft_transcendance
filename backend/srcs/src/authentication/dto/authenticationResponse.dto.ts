import User from 'src/users/user.interface';

export interface AuthenticationResponseDto {
  user?: User;
  twoFactorAuthEnabled: boolean;
}
