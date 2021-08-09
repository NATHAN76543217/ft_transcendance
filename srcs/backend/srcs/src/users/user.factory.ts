import Faker from 'faker'
import { define } from 'typeorm-seeding'
import User from './user.entity';

export default define(User, (faker: typeof Faker) => {
    const firstName = faker.name.firstName(1)
    const lastName = faker.name.lastName(1)
  
    faker.locale = "fr";
    const user = new User();
    user.name = `${firstName} ${lastName}`;
    user.password = faker.random.word();
    faker.locale = "en";
    console.log("faker", faker);
    console.log("datatype", faker.datatype);
    user.nbWin = faker.random.number({
      'min': 0,
      'max': 50
    });
    user.nbLoss = faker.random.number({
      'min': 0,
      'max': 50
    })
    // TODO see for updating faker to newer version to use bellow syntax
    // user.nbWin = faker.datatype.number({
    //   'min': 0,
    //   'max': 50
    // });
    // user.nbLoss = faker.datatype.number({
    //   'min': 0,
    //   'max': 50
    // });
    // TODO auto path to auto logo

    return user
  })