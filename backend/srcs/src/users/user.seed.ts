import User from "./user.entity";
import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'

// create-pets.seed.ts
export default class CreateUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      await factory(User)().createMany(10)
    }
}