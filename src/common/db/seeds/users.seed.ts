import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../../users/entities';

// create-pets.seed.ts
export default class CreateDefaultUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getRepository(User);

    // Check if the user already exists
    const existingUsers = await userRepository.find();

    if (existingUsers.length > 0) {
      console.log('✅ Default users already exist, skipping seeding.');
      return;
    }

    // Create default users
    console.log('Seeding default users...');
    const users: User[] = [
      {
        username: 'admin',
        email: 'admin@email.com',
        password: 'admin123',
      },
      {
        username: 'user',
        email: 'user@email.com',
        password: 'user123',
      },
    ];

    await userRepository.save(users);
    console.log('✅ Default users seeded successfully.');
  }
}
