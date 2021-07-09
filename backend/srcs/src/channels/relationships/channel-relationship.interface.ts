import { ChannelRelationshipType } from './channel-relationship.type';

export default class ChannelRelationship {
  channel_id: number;
  user_id: number;
  type: ChannelRelationshipType;
}
