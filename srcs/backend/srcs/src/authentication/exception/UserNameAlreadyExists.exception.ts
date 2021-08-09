import { BadRequestException } from '@nestjs/common';
 
export default class UserNameAlreadyExistsException extends BadRequestException {
  constructor(userName: string) {
    super(`User with name ${userName} already exists`);
  }
}
