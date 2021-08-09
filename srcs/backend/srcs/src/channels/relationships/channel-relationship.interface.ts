import Channel from '../channel.interface';
import { ChannelRelationshipType } from './channel-relationship.type';

export default class ChannelRelationship {
  channel_id: number; // TODO: Maybe add channel_id to leftjoin selects
  user_id: number;
  type: ChannelRelationshipType;
  channel: Channel;
}
