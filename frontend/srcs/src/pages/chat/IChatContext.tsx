import { UserChannelRelationship } from "../../models/user/IUser";

export interface IChatContext {
  channelRels: Map<number, UserChannelRelationship>;
  currentChannelRel?: UserChannelRelationship;
  setChannelRels: any
  setCurrentChannelRel: any
}
