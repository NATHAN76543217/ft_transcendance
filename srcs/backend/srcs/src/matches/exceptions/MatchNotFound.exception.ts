import { NotFoundException } from '@nestjs/common/exceptions';

export default class MatchNotFound extends NotFoundException {
  constructor(id: number) {
    super(`Match ${id} not found`);
  }
}
