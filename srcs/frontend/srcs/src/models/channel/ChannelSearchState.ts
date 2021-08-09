import { Channel } from "./Channel";
import { ChannelRelationshipType } from "./ChannelRelationship";

export default interface ChannelSearchState {
  list: {
    channel: Channel,
    relationType: ChannelRelationshipType
  }[];
  channelName: string;
}

export interface ChannelSearchListElement {
  channel: Channel,
  relationType: ChannelRelationshipType
};
