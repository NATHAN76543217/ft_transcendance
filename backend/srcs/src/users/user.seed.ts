// import User from "./user.entity";
// import { Factory, Seeder } from 'typeorm-seeding'
// import { Connection } from 'typeorm'
// import Message from "../messages/message.entity";

// export default class CreateUser implements Seeder {
//     public async run(factory: Factory, connection: Connection): Promise<any> {
//       await factory(User)().createMany(20)
//       await factory(User)()
//         .map(async (user: User) => {
//           console.log("user ", user)
//           const messages: Message[] = await factory(Message)().createMany(2, {id_sender: user.id})
//           await user.messages().attach(petIds);
//           return user;
//         })
//         .createMany(5)
//     }
// }