import { ChannelMode } from "./Channel";

export default interface CreateChannelDto {
    name: string,
    password?: string,
    mode: ChannelMode,
}