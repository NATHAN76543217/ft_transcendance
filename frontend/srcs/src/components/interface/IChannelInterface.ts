import { ChannelModeTypes } from "../channels/channelModeTypes";
import { ChannelRelationshipTypes } from "../channels/channelRelationshipTypes";

export default interface Channel {
    id: string;

    name: string;

    password: string;

    mode: ChannelModeTypes;

    type: ChannelRelationshipTypes;

    // messages: Message[];

    // users: User[];
}