import { UnauthorizedException } from "@nestjs/common";

export class UserBannedException extends UnauthorizedException {
    constructor() {
      super("You are banned.");
    }
  }
  