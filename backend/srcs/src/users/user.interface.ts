import Channel from '../channels/channel.entity';

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
    channels: Channel[];
}
