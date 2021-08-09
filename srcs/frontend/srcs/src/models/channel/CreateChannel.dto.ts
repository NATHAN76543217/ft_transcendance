import { ChannelMode } from "./Channel";

export default interface CreateChannelDto {
    name: string,
    password?: string,
    passwordConfirmation?: string,
    mode: ChannelMode,
}