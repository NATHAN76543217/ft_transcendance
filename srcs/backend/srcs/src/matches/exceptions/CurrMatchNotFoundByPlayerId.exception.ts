import { NotFoundException } from '@nestjs/common/exceptions';

export default class CurrMatchNotFoundByPlayerId extends NotFoundException {
  constructor(id: string) {
    super(`There's not current matches with player ${id} in`);
  }
}
