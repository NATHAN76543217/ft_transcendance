import Channel from './IChannelInterface';
import { UserRelationshipTypes } from '../../components/userInformation/userRelationshipTypes';

export default interface User {
    id: string;
    name: string;
    password: string;
    nbWin: number;
    nbLoss: number;
    stats: number;
    imgPath: string;
    twoFactorAuth: boolean;
    status: string;
    channels: Channel[];
    relationshipType: UserRelationshipTypes;
    idInf: boolean
    // isBlock: boolean;
}