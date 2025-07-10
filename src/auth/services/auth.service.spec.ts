import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDoc } from '@users/docs';
import { UsersService } from '@users/services';
import { hashSync } from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockedUsersService = {
    findUser: jest.fn(),
  };
  const mockedJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockedUsersService },
        { provide: JwtService, useValue: mockedJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'testuser@email.com',
      password: hashSync('testuserpassword', 10),
    };

    it('should return user data without password if credentials are valid', async () => {
      mockedUsersService.findUser.mockResolvedValue(user);

      const result = await service.validateUser(
        user.username,
        'testuserpassword',
      );

      expect(result).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockedUsersService.findUser.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistentuser', 'password'),
      ).rejects.toThrow('User not found');
    });

    it('should return null if password is invalid', async () => {
      mockedUsersService.findUser.mockResolvedValue(user);

      const result = await service.validateUser(user.username, 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const userDoc: UserDoc = {
      id: 1,
      username: 'testuser',
      email: 'testuser@email.com',
    };

    it('should return an access token', () => {
      const payload = { username: userDoc.username, sub: userDoc.id };
      mockedJwtService.sign.mockReturnValue('mockedAccessToken');

      const result = service.login(userDoc);

      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(mockedJwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
});
