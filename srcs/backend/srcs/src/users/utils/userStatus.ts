export enum UserStatus {
    null = 0,
    
    offline = 1 << 0,
    online = 1 << 1,
    inGame = 1 << 2,
}
