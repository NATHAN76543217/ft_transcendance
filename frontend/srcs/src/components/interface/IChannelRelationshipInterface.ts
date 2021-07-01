import { ChannelRelationshipTypes } from '../channels/channelRelationshipTypes';

export default interface IChannelRelationship {
    id: number;
    type: ChannelRelationshipTypes;
    channel_id: string;
    user_id: string;
    user_name: string;
}