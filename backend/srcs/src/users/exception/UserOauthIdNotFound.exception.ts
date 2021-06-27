import { NotFoundException } from '@nestjs/common';
 
export default class UserOauthIdNotFoundException extends NotFoundException {
  constructor(oauthId: number) {
    super(`User with oauth id ${oauthId} not found`);
  }
}
