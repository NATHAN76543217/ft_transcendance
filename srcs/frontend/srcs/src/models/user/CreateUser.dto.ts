import { UserStatus } from "./IUser";

export default interface IUserCreateFormValues {
    name: string,
    status: UserStatus,
    nbWin?: number;
    nbLoss?: number;
    stats?: number;
    imgPath?: string;
    twoFactorAuth?: boolean;
}