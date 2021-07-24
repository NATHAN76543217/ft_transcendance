export enum UserRole {
  User = 1,

  Owner = User << 1,
  Admin = Owner << 1,

  Banned = Admin << 1,

  Sanctioned = UserRole.Banned,
}
