import { ChannelRelationshipType } from "./ChannelRelationship";

export default interface JoinChannelDto {
    password?: string,
    type: ChannelRelationshipType,
}