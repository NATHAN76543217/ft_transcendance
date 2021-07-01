import { ChannelModeTypes } from "../channels/channelModeTypes";

export default interface Channel {
    id: string;

    name: string;

    password: string;

    mode: ChannelModeTypes;

    // messages: Message[];

    // users: User[];
}