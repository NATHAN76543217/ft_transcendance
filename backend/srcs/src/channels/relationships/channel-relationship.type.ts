import { UserRole } from 'src/users/utils/userRole';

export enum ChannelRelationshipType {
  Member = UserRole.User,

  /** Channel owner */
  Owner = UserRole.Owner,
  /** Channel administrator */
  Admin = UserRole.Admin,

  /** Banned user */
  Banned = UserRole.Banned,
  /** Muted user */
  Muted = ChannelRelationshipType.Banned << 1,

  /** Invited member */
  Invited = ChannelRelationshipType.Muted << 1,

  /** Sanction mask */
  Sanctioned = ChannelRelationshipType.Banned | ChannelRelationshipType.Muted,
}
