import { NotFoundException } from '@nestjs/common';

export default class UserRelationshipByNameNotFoundException extends NotFoundException {
  constructor(userId1: string, userId2: string) {
    super(`UserRelationship with userIds ${userId1} and ${userId1} not found`);
  }
}
