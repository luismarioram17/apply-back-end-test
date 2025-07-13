import { hashSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import ormconfig from '../ormconfig';

async function seed() {
  const dataSource = new DataSource(ormconfig);
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);

  const adminPassword = hashSync('adminpassword', 10);
  const userPassword = hashSync('userpassword', 10);

  const admin = userRepo.create({
    username: 'admin',
    email: 'admin@example.com',
    password: adminPassword,
  });

  const user = userRepo.create({
    username: 'user',
    email: 'user@example.com',
    password: userPassword,
  });

  await userRepo.save([admin, user]);
  console.log('Seeded admin and user');
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
