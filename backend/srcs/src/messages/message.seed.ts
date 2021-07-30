import Message from "./message.entity";
import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'

export default class CreateMessage implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      await factory(Message)().createMany(20)
    }
}