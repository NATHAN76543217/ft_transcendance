import { UserStatus } from "./IUser";

export default interface IUserUpdateFormValues {
    name?: string,
    password?: string,
    nbWin?: number;
    nbLoss?: number;
    stats?: number;
    imgPath?: string;
    twoFactorAuth?: boolean;
    status?: UserStatus,
}