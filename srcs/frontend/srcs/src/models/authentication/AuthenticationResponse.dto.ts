import { IUser } from "../user/IUser";

export interface AuthenticationResponseDto {
  user?: IUser;
  twoFactorAuthEnabled: boolean;
}
