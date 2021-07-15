export enum ChannelRelationshipType {
  null = 0,

  /**  Normal member */
  member = 1 << 0,

  /** Channel owner */
  owner = 1 << 1,
  /** Channel administrator */
  admin = 1 << 2,

  /** Invited member */
  invited = 1 << 3,

  /** Banned user */
  banned = 1 << 4,
  /** Muted user */
  muted = 1 << 5,
  /** Sanction mask */
  sanctioned = banned | muted,
}