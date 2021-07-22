import { NotFoundException } from "@nestjs/common/exceptions";

export default class UserNameNotFoundException extends NotFoundException {
    constructor(name: string) {
        super(`User with name ${name} not found`);
    }
}
  
  