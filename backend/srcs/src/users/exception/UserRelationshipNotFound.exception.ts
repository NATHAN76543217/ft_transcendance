import { NotFoundException } from '@nestjs/common';

export default class UserRelationshipNotFoundException extends NotFoundException {
  constructor(userRelationshipId: number) {
    super(`UserRelationship with id ${userRelationshipId} not found`);
  }
}
