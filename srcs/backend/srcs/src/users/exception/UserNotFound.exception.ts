import { NotFoundException } from '@nestjs/common';
 
export default class UserNotFoundException extends NotFoundException {
  constructor(userId: number) {
    super(`User with id ${userId} not found`);
  }
}
