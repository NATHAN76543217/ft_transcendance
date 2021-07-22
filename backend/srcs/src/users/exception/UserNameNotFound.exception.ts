import { BadRequestException } from '@nestjs/common/exceptions';

export default class UserNameInvalid extends BadRequestException {
  constructor(name: string) {
    super(`Username ${name} is not valid or already taken`);
  }
}
