import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities';
import { UsersService } from '@users/services';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    repository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    let users: User[];

    beforeEach(async () => {
      users = await repository.save([
        {
          username: 'testuser',
          email: 'testuser01@email.com',
          password: 'password123',
        },
        {
          username: 'anotheruser',
          email: 'anotheruser01@email.com',
          password: 'password123',
        },
      ]);
    });

    it('should find a user by username', async () => {
      const result = await service.findUser(users[0].username);

      expect(result).toBeDefined();

      expect(result?.username).toBe(users[0].username);
      expect(result?.email).toBe(users[0].email);
    });

    it('should find a user by email', async () => {
      const result = await service.findUser(users[1].email);

      expect(result).toBeDefined();
      expect(result?.username).toBe(users[1].username);
      expect(result?.email).toBe(users[1].email);
    });

    it('should return null if user is not found', async () => {
      const result = await service.findUser('nonexistentuser');

      expect(result).toBeNull();
    });
  });

  afterEach(async () => {
    await repository.clear();
  });
});
