import { AuthService } from '@auth/services';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should return user if credentials are valid', async () => {
    const mockUser = { id: 1, username: 'test' };
    mockAuthService.validateUser.mockResolvedValue(mockUser);

    const result = await localStrategy.validate('test', 'password');
    expect(result).toBe(mockUser);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      'test',
      'password',
    );
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(
      localStrategy.validate('test', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      'test',
      'wrongpassword',
    );
  });
});
