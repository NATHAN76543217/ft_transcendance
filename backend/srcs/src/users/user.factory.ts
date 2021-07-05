import Faker from 'faker'
import { define } from 'typeorm-seeding'
import User from './user.entity';
export default define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1)
    const firstName = faker.name.firstName(gender)
    const lastName = faker.name.lastName(gender)
  
    const user = new User()
    user.name = `${firstName} ${lastName}`
    user.password = faker.random.word()
    return user
  })