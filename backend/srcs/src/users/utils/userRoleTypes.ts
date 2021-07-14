export enum UserRoleTypes {
    null = 0,
    
    admin = 1 << 0,
    owner = 1 << 1,

    ban = 1 << 2,
}
