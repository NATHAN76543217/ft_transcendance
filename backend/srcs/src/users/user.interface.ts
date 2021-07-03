import Channel from '../channels/channel.entity';
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
    channels: Channel[];
}
