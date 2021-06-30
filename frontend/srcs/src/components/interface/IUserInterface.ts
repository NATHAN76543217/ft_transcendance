import Channel from './IChannelInterface';
import { UserRelationshipTypes } from '../users/userRelationshipTypes';
import { UserRoleTypes } from '../users/userRoleTypes';

export default interface IUser {
    id: string;
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
    relationshipType: UserRelationshipTypes;
    idInf: boolean
    // isBlock: boolean;
}