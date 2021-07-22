export enum UserRole {
  User = 0,

  Admin = 1 << 0,
  Owner = 1 << 1,

  Banned = 1 << 2,

  Sanctioned = UserRole.Banned,
}
