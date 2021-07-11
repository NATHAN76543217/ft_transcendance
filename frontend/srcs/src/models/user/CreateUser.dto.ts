
export default interface IUserCreateFormValues {
    name: string,
    status: string,
    nbWin?: number;
    nbLoss?: number;
    stats?: number;
    imgPath?: string;
    twoFactorAuth?: boolean;
}