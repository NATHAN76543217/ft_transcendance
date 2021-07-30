import Faker from 'faker'
import { define } from 'typeorm-seeding'
import Message from './message.entity';
import User from '../users/user.entity';
import {getRepository} from "typeorm";

//TODO if can't be in userServices so put it in utils
async function getRandomUser(): Promise<User> {
    const array = await getRepository(User).createQueryBuilder()
        .select('*')
        .orderBy('RANDOM()')
        .limit(1)
        .execute();
    console.log("array = ", array);
    return array[0];
}

export default define(Message, (faker: typeof Faker) => {
    faker.locale = "fr";
  
    const message = new Message();
    message.text = faker.lorem.text();  
    // getRandomUser().then((user : User) => {
    //     console.log("user=", user);
    //     message.id_sender = user.id;
    // })
    message.id_sender = 1;
    return message;
})