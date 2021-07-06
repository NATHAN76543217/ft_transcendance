import { ChannelRelationshipTypes } from './channelRelationshipTypes';

export default class ChannelRelationship {
  channel_id: number;
  user_id: number;
  type: ChannelRelationshipTypes;
}
